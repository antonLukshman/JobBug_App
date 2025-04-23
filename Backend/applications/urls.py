from django.urls import path, include
from rest_framework.routers import DefaultRouter
from applications.views import (
    ApplicationViewSet,
    EmployerApplicationsViewSet,
    ApplicationTrackingView
)

router = DefaultRouter()
router.register(r'my', ApplicationViewSet, basename='my-application')
router.register(r'employer', EmployerApplicationsViewSet, basename='employer-application')

urlpatterns = [
    path('', include(router.urls)),
    path('track/<str:tracking_id>/', ApplicationTrackingView.as_view(), name='track-application'),
]
