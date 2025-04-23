from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    """
    User profile model extends the built-in Django User model.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    firebase_uid = models.CharField(max_length=128, unique=True)
    email = models.EmailField(max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class SocialProfile(models.Model):
    """
    Social media profiles for users
    """
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='social_profiles')
    platform = models.CharField(max_length=50)  # e.g., LinkedIn, GitHub, Twitter
    url = models.URLField()
    
    def __str__(self):
        return f"{self.user.email} - {self.platform}"
        
class JobPreference(models.Model):
    """
    Job preferences for job seekers
    """
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='job_preference')
    job_types = models.JSONField(default=list, blank=True)  # e.g., ["Full-time", "Part-time"]
    preferred_locations = models.JSONField(default=list, blank=True)  # e.g., ["New York", "Remote"]
    min_salary = models.IntegerField(null=True, blank=True)
    remote_only = models.BooleanField(default=False)
    willing_to_relocate = models.BooleanField(default=False)
    preferred_industries = models.JSONField(default=list, blank=True)  # e.g., ["Technology", "Finance"]
    
    def __str__(self):
        return f"Job Preferences for {self.user.email}"

class SavedSearch(models.Model):
    """
    Saved job searches by users
    """
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='saved_searches')
    query = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    filters = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.query}"
