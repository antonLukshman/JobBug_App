from django.db import models
from users.models import UserProfile

class Category(models.Model):
    """
    Job category model
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Company(models.Model):
    """
    Company model for job listings
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)  # e.g., "1-10", "11-50", etc.
    founded_year = models.PositiveIntegerField(blank=True, null=True)
    created_by = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='companies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Companies"

class Job(models.Model):
    """
    Job listing model
    """
    JOB_TYPE_CHOICES = [
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('temporary', 'Temporary'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('executive', 'Executive Level'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='jobs')
    location = models.CharField(max_length=100)
    is_remote = models.BooleanField(default=False)
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField(blank=True, null=True)
    benefits = models.TextField(blank=True, null=True)
    salary_min = models.PositiveIntegerField(blank=True, null=True)
    salary_max = models.PositiveIntegerField(blank=True, null=True)
    salary_currency = models.CharField(max_length=3, default='USD')
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full-time')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='mid')
    skills = models.JSONField(default=list, blank=True)
    application_link = models.URLField(blank=True, null=True)
    application_email = models.EmailField(blank=True, null=True)
    application_deadline = models.DateField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_urgent = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    applicants_count = models.PositiveIntegerField(default=0)
    posted_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='posted_jobs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} at {self.company.name}"
    
    def increment_views(self):
        """
        Increment the views count for this job
        """
        self.views_count += 1
        self.save(update_fields=['views_count'])
    
    def increment_applicants(self):
        """
        Increment the applicants count for this job
        """
        self.applicants_count += 1
        self.save(update_fields=['applicants_count'])

class SavedJob(models.Model):
    """
    Jobs saved by users
    """
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'job')
        
    def __str__(self):
        return f"{self.user.email} - {self.job.title}"
