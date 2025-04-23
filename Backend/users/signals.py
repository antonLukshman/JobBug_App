from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from users.models import UserProfile, JobPreference

@receiver(post_save, sender=UserProfile)
def create_job_preference(sender, instance, created, **kwargs):
    """
    Create job preference when a new user profile is created
    """
    if created:
        JobPreference.objects.get_or_create(user=instance)