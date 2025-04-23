
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from users.models import UserProfile, SocialProfile, JobPreference, SavedSearch
from users.serializers import (
    UserProfileSerializer, 
    SocialProfileSerializer, 
    JobPreferenceSerializer, 
    SavedSearchSerializer,
    CreateUserProfileSerializer
)

class CreateUserProfileView(APIView):
    """
    Create a new user profile from Firebase auth.
    This endpoint is public because it's called right after Firebase signup.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = CreateUserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User profile created successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user profiles
    """
    serializer_class = UserProfileSerializer
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get the authenticated user's profile
        """
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def update_me(self, request):
        """
        Update the authenticated user's profile
        """
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def upload_resume(self, request):
        """
        Upload user's resume
        """
        profile = self.get_object()
        if 'resume' not in request.FILES:
            return Response(
                {"error": "No resume file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        profile.resume = request.FILES['resume']
        profile.save()
        
        return Response(
            {"message": "Resume uploaded successfully"},
            status=status.HTTP_200_OK
        )

class SocialProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint for social profiles
    """
    serializer_class = SocialProfileSerializer
    
    def get_queryset(self):
        return SocialProfile.objects.filter(user__user=self.request.user)
    
    def perform_create(self, serializer):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        serializer.save(user=user_profile)

class JobPreferenceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for job preferences
    """
    serializer_class = JobPreferenceSerializer
    
    def get_queryset(self):
        return JobPreference.objects.filter(user__user=self.request.user)
    
    def perform_create(self, serializer):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        # Delete existing job preference if exists
        JobPreference.objects.filter(user=user_profile).delete()
        serializer.save(user=user_profile)
    
    @action(detail=False, methods=['get'])
    def my_preferences(self, request):
        """
        Get the authenticated user's job preferences
        """
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        preferences, created = JobPreference.objects.get_or_create(user=user_profile)
        serializer = self.get_serializer(preferences)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def update_preferences(self, request):
        """
        Update the authenticated user's job preferences
        """
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        preferences, created = JobPreference.objects.get_or_create(user=user_profile)
        serializer = self.get_serializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SavedSearchViewSet(viewsets.ModelViewSet):
    """
    API endpoint for saved searches
    """
    serializer_class = SavedSearchSerializer
    
    def get_queryset(self):
        return SavedSearch.objects.filter(user__user=self.request.user)
    
    def perform_create(self, serializer):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        serializer.save(user=user_profile)