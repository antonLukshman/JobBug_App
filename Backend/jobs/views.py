from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend

from jobs.models import Category, Company, Job, SavedJob
from jobs.serializers import (
    CategorySerializer,
    CompanySerializer,
    CompanyCreateSerializer,
    JobListSerializer,
    JobDetailSerializer,
    JobCreateSerializer,
    SavedJobSerializer
)
from users.models import UserProfile
from django.shortcuts import get_object_or_404

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for job categories
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class CompanyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for companies
    """
    queryset = Company.objects.all()
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'industry', 'location']
    filterset_fields = ['industry', 'size']
    
    def get_permissions(self):
        """
        Allow any user to view companies, but require authentication for create, update, delete
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CompanyCreateSerializer
        return CompanySerializer
    
    def perform_create(self, serializer):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        serializer.save(created_by=user_profile)

class JobViewSet(viewsets.ModelViewSet):
    """
    API endpoint for job listings
    """
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title', 'description', 'company__name', 'location']
    filterset_fields = {
        'job_type': ['exact'],
        'experience_level': ['exact'],
        'is_remote': ['exact'],
        'is_featured': ['exact'],
        'is_urgent': ['exact'],
        'category': ['exact'],
        'salary_min': ['gte'],
        'salary_max': ['lte'],
        'created_at': ['gte', 'lte'],
    }
    ordering_fields = ['created_at', 'views_count', 'applicants_count', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        
        # Filter by location if provided
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(
                Q(location__icontains=location) | 
                Q(is_remote=True)
            )
        
        # Filter by skills if provided
        skills = self.request.query_params.get('skills', None)
        if skills:
            skill_list = [skill.strip() for skill in skills.split(',')]
            for skill in skill_list:
                queryset = queryset.filter(skills__contains=[skill])
        
        return queryset
    
    def get_permissions(self):
        """
        Allow any user to view jobs, but require authentication for create, update, delete
        """
        if self.action in ['list', 'retrieve', 'featured', 'by_category']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update' or self.action == 'partial_update':
            return JobCreateSerializer
        if self.action == 'retrieve':
            return JobDetailSerializer
        return JobListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment the views count
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        serializer.save(posted_by=user_profile)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured job listings
        """
        featured_jobs = Job.objects.filter(is_active=True, is_featured=True)
        serializer = self.get_serializer(featured_jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Get jobs by category
        """
        category_slug = request.query_params.get('slug', None)
        if not category_slug:
            return Response(
                {"error": "Category slug is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        jobs = Job.objects.filter(
            is_active=True,
            category__slug=category_slug
        )
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_jobs(self, request):
        """
        Get jobs posted by the authenticated user
        """
        user_profile = get_object_or_404(UserProfile, user=request.user)
        jobs = Job.objects.filter(posted_by=user_profile)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

class SavedJobViewSet(viewsets.ModelViewSet):
    """
    API endpoint for saved jobs
    """
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedJob.objects.filter(user__user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """
        Toggle save/unsave job
        """
        job_id = request.data.get('job_id')
        if not job_id:
            return Response(
                {"error": "Job ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_profile = get_object_or_404(UserProfile, user=request.user)
        saved_job = SavedJob.objects.filter(user=user_profile, job_id=job_id).first()
        
        if saved_job:
            # Unsave job
            saved_job.delete()
            return Response(
                {"message": "Job unsaved successfully"},
                status=status.HTTP_200_OK
            )
        else:
            # Save job
            job = get_object_or_404(Job, id=job_id)
            SavedJob.objects.create(user=user_profile, job=job)
            return Response(
                {"message": "Job saved successfully"},
                status=status.HTTP_201_CREATED
            )
