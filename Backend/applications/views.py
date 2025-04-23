from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from applications.models import Application, ApplicationNote, StatusUpdate
from applications.serializers import (
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationUpdateSerializer,
    ApplicationNoteSerializer,
    ApplicationNoteCreateSerializer,
    ApplicationTrackingSerializer
)
from users.models import UserProfile
from django.shortcuts import get_object_or_404

class ApplicationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for applications
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['application_date', 'updated_at']
    ordering = ['-application_date']
    
    def get_queryset(self):
        user_profile = self.request.user.profile
        
        # Get all applications where the user is the applicant
        return Application.objects.filter(applicant=user_profile)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        if self.action == 'update' or self.action == 'partial_update':
            return ApplicationUpdateSerializer
        return ApplicationSerializer
    
    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user.profile)
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """
        Add a note to an application
        """
        application = self.get_object()
        serializer = ApplicationNoteCreateSerializer(
            data=request.data,
            context={'request': request, 'application_id': application.id}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """
        Withdraw an application
        """
        application = self.get_object()
        application.status = 'withdrawn'
        application.save()
        
        # Create status update
        previous_status = application.status
        StatusUpdate.objects.create(
            application=application,
            previous_status=previous_status,
            new_status='withdrawn',
            updated_by=request.user.profile,
            note="Application withdrawn by applicant"
        )
        
        return Response({'message': 'Application withdrawn successfully'})

class ApplicationTrackingView(APIView):
    """
    Public API endpoint for tracking an application status
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, tracking_id):
        """
        Get the status of an application using the tracking ID
        """
        application = get_object_or_404(Application, tracking_id=tracking_id)
        serializer = ApplicationTrackingSerializer(application)
        return Response(serializer.data)

class EmployerApplicationsViewSet(viewsets.ModelViewSet):
    """
    API endpoint for employers to manage applications to their jobs
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'job']
    ordering_fields = ['application_date', 'updated_at']
    ordering = ['-application_date']
    
    def get_queryset(self):
        user_profile = self.request.user.profile
        
        # Get all applications for jobs posted by the user
        return Application.objects.filter(job__posted_by=user_profile)
    
    def get_serializer_class(self):
        if self.action == 'update' or self.action == 'partial_update':
            return ApplicationUpdateSerializer
        return ApplicationSerializer
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """
        Add a note to an application
        """
        application = self.get_object()
        serializer = ApplicationNoteCreateSerializer(
            data=request.data,
            context={'request': request, 'application_id': application.id}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update the status of an application
        """
        application = self.get_object()
        
        # Validate status
        status_value = request.data.get('status')
        if not status_value:
            return Response(
                {"error": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check if status is valid
        if status_value not in dict(Application.STATUS_CHOICES):
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get note if provided
        note = request.data.get('note', '')
        
        # Store previous status
        previous_status = application.status
        
        # Update status
        application.status = status_value
        application.save()
        
        # Create status update record
        StatusUpdate.objects.create(
            application=application,
            previous_status=previous_status,
            new_status=status_value,
            updated_by=request.user.profile,
            note=note
        )
        
        return Response(
            {"message": f"Application status updated to {status_value}"},
            status=status.HTTP_200_OK
        )
