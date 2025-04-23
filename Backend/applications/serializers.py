from rest_framework import serializers
from applications.models import Application, ApplicationNote, StatusUpdate
from jobs.serializers import JobListSerializer
from users.serializers import UserProfileSerializer

class StatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for the StatusUpdate model
    """
    updated_by = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = StatusUpdate
        fields = ['id', 'previous_status', 'new_status', 'note', 'updated_by', 'created_at']
        read_only_fields = ['created_at']

class ApplicationNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for the ApplicationNote model
    """
    created_by = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = ApplicationNote
        fields = ['id', 'text', 'created_by', 'created_at']
        read_only_fields = ['created_at']

class ApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Application model
    """
    job = JobListSerializer(read_only=True)
    status_history = StatusUpdateSerializer(many=True, read_only=True)
    notes = ApplicationNoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Application
        fields = ['id', 'applicant', 'job', 'resume', 'cover_letter', 'status',
                  'application_date', 'updated_at', 'tracking_id', 'status_history', 'notes']
        read_only_fields = ['applicant', 'application_date', 'updated_at', 'tracking_id']

class ApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new application
    """
    job_id = serializers.IntegerField()
    
    class Meta:
        model = Application
        fields = ['job_id', 'resume', 'cover_letter']
    
    def create(self, validated_data):
        job_id = validated_data.pop('job_id')
        user_profile = self.context['request'].user.profile
        
        # Check if user has already applied to this job
        if Application.objects.filter(applicant=user_profile, job_id=job_id).exists():
            raise serializers.ValidationError({"job_id": "You have already applied to this job"})
        
        return Application.objects.create(
            applicant=user_profile,
            job_id=job_id,
            **validated_data
        )

class ApplicationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating an application
    """
    class Meta:
        model = Application
        fields = ['status']
    
    def update(self, instance, validated_data):
        previous_status = instance.status
        new_status = validated_data.get('status', previous_status)
        
        # Create status update record if status has changed
        if previous_status != new_status:
            user_profile = self.context['request'].user.profile
            StatusUpdate.objects.create(
                application=instance,
                previous_status=previous_status,
                new_status=new_status,
                updated_by=user_profile
            )
        
        return super().update(instance, validated_data)

class ApplicationTrackingSerializer(serializers.ModelSerializer):
    """
    Serializer for tracking an application
    """
    job = JobListSerializer(read_only=True)
    status_history = StatusUpdateSerializer(many=True, read_only=True)
    
    class Meta:
        model = Application
        fields = ['id', 'job', 'status', 'application_date', 'updated_at', 
                  'tracking_id', 'status_history']
        read_only_fields = ['id', 'job', 'status', 'application_date', 
                           'updated_at', 'tracking_id', 'status_history']

class ApplicationNoteCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a note on an application
    """
    class Meta:
        model = ApplicationNote
        fields = ['text']
    
    def create(self, validated_data):
        application_id = self.context['application_id']
        user_profile = self.context['request'].user.profile
        
        return ApplicationNote.objects.create(
            application_id=application_id,
            created_by=user_profile,
            **validated_data
        )
