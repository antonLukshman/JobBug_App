from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import (
    CreateUserProfileView,
    UserProfileViewSet,
    SocialProfileViewSet,
    JobPreferenceViewSet,
    SavedSearchViewSet
)

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'social-profiles', SocialProfileViewSet, basename='social-profile')
router.register(r'job-preferences', JobPreferenceViewSet, basename='job-preference')
router.register(r'saved-searches', SavedSearchViewSet, basename='saved-search')

urlpatterns = [
    path('', include(router.urls)),
    path('create-profile/', CreateUserProfileView.as_view(), name='create-profile'),
]
