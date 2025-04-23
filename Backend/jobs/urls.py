from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobs.views import (
    CategoryViewSet,
    CompanyViewSet,
    JobViewSet,
    SavedJobViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'listings', JobViewSet, basename='job')
router.register(r'saved', SavedJobViewSet, basename='saved-job')

urlpatterns = [
    path('', include(router.urls)),
]
