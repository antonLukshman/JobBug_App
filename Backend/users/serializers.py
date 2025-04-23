
from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import UserProfile, SocialProfile, JobPreference, SavedSearch

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['username']

class SocialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ['id', 'platform', 'url']

class JobPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPreference
        fields = ['id', 'job_types', 'preferred_locations', 'min_salary', 
                 'remote_only', 'willing_to_relocate', 'preferred_industries']

class SavedSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedSearch
        fields = ['id', 'query', 'location', 'filters', 'created_at']
        read_only_fields = ['created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    social_profiles = SocialProfileSerializer(many=True, read_only=True)
    job_preference = JobPreferenceSerializer(read_only=True)
    saved_searches = SavedSearchSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'firebase_uid', 'email', 'first_name', 'last_name',
                  'profile_picture', 'phone_number', 'bio', 'resume', 'skills',
                  'social_profiles', 'job_preference', 'saved_searches',
                  'created_at', 'updated_at']
        read_only_fields = ['firebase_uid', 'created_at', 'updated_at']

class CreateUserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user profile from Firebase auth
    """
    uid = serializers.CharField(required=True, write_only=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    class Meta:
        model = UserProfile
        fields = ['uid', 'email', 'first_name', 'last_name']
    
    def create(self, validated_data):
        uid = validated_data.pop('uid')
        email = validated_data.get('email')
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        
        # Create Django user
        user = User.objects.create(
            username=uid,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=True
        )
        
        # Create user profile
        profile = UserProfile.objects.create(
            user=user,
            firebase_uid=uid,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        
        return profile