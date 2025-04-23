from rest_framework import serializers
from jobs.models import Category, Company, Job, SavedJob
from users.serializers import UserProfileSerializer

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model
    """
    jobs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'description', 'created_at', 'jobs_count']
        read_only_fields = ['created_at', 'jobs_count']
    
    def get_jobs_count(self, obj):
        return obj.jobs.count()

class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for the Company model
    """
    created_by = UserProfileSerializer(read_only=True)
    jobs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'logo', 'website', 'description', 'industry',
                  'location', 'size', 'founded_year', 'created_by', 'created_at',
                  'updated_at', 'jobs_count']
        read_only_fields = ['created_at', 'updated_at', 'jobs_count']
    
    def get_jobs_count(self, obj):
        return obj.jobs.count()

class CompanyCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a Company
    """
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'logo', 'website', 'description', 'industry',
                  'location', 'size', 'founded_year']

class JobListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing Jobs
    """
    company_name = serializers.ReadOnlyField(source='company.name')
    company_logo = serializers.SerializerMethodField()
    category_name = serializers.ReadOnlyField(source='category.name')
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = ['id', 'title', 'slug', 'company', 'company_name', 'company_logo',
                  'category', 'category_name', 'location', 'is_remote', 'salary_min',
                  'salary_max', 'salary_currency', 'job_type', 'experience_level',
                  'is_featured', 'is_urgent', 'views_count', 'applicants_count', 
                  'created_at', 'is_saved']
        read_only_fields = ['views_count', 'applicants_count', 'created_at', 'is_saved']
    
    def get_company_logo(self, obj):
        if obj.company.logo:
            return self.context['request'].build_absolute_uri(obj.company.logo.url)
        return None
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                user_profile = request.user.profile
                return SavedJob.objects.filter(user=user_profile, job=obj).exists()
            except:
                return False
        return False

class JobDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for Job details
    """
    company = CompanySerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    posted_by = UserProfileSerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = ['id', 'title', 'slug', 'company', 'category', 'location', 'is_remote',
                  'description', 'requirements', 'responsibilities', 'benefits',
                  'salary_min', 'salary_max', 'salary_currency', 'job_type',
                  'experience_level', 'skills', 'application_link', 'application_email',
                  'application_deadline', 'is_featured', 'is_active', 'is_urgent',
                  'views_count', 'applicants_count', 'posted_by', 'created_at', 
                  'updated_at', 'is_saved']
        read_only_fields = ['views_count', 'applicants_count', 'created_at', 
                            'updated_at', 'is_saved']
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                user_profile = request.user.profile
                return SavedJob.objects.filter(user=user_profile, job=obj).exists()
            except:
                return False
        return False

class JobCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a Job
    """
    company_id = serializers.IntegerField()
    category_id = serializers.IntegerField(required=False, allow_null=True)
    
    class Meta:
        model = Job
        fields = ['id', 'title', 'slug', 'company_id', 'category_id', 'location',
                  'is_remote', 'description', 'requirements', 'responsibilities',
                  'benefits', 'salary_min', 'salary_max', 'salary_currency',
                  'job_type', 'experience_level', 'skills', 'application_link',
                  'application_email', 'application_deadline', 'is_featured',
                  'is_active', 'is_urgent']
    
    def create(self, validated_data):
        company_id = validated_data.pop('company_id')
        category_id = validated_data.pop('category_id', None)
        
        # Set company and category
        validated_data['company_id'] = company_id
        if category_id:
            validated_data['category_id'] = category_id
        
        # Set the posted_by to the authenticated user
        user_profile = self.context['request'].user.profile
        validated_data['posted_by'] = user_profile
        
        return super().create(validated_data)

class SavedJobSerializer(serializers.ModelSerializer):
    """
    Serializer for SavedJob model
    """
    job = JobListSerializer(read_only=True)
    job_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'job_id', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        job_id = validated_data.pop('job_id')
        user_profile = self.context['request'].user.profile
        
        # Check if already saved
        if SavedJob.objects.filter(user=user_profile, job_id=job_id).exists():
            raise serializers.ValidationError({"job_id": "Job already saved by user"})
        
        return SavedJob.objects.create(user=user_profile, job_id=job_id)
