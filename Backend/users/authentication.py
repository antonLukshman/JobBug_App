import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings
from rest_framework import authentication, exceptions
from django.contrib.auth.models import User
from users.models import UserProfile

# Initialize Firebase Admin SDK
if settings.FIREBASE_CONFIG:
    cred = credentials.Certificate(settings.FIREBASE_CONFIG)
    firebase_admin.initialize_app(cred)
else:
    # In development or testing, use a mock for Firebase
    print("Warning: Firebase credentials not configured. Authentication will not work properly.")

class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Firebase authentication for DRF.
    
    Client should include a Firebase ID token in the Authorization header in the format:
    Authorization: Firebase <token>
    """
    
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Firebase '):
            return None
        
        token = auth_header.split(' ')[1]
        
        if not token:
            return None
        
        try:
            # Verify the token with Firebase
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            
            # Get or create a Django user
            try:
                user_profile = UserProfile.objects.get(firebase_uid=uid)
                user = user_profile.user
            except UserProfile.DoesNotExist:
                # If we don't find a user, create a new one based on Firebase data
                email = decoded_token.get('email', f"{uid}@example.com")
                name_parts = decoded_token.get('name', 'Firebase User').split()
                first_name = name_parts[0] if name_parts else "Firebase"
                last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else "User"
                
                # Create Django user
                user, created = User.objects.get_or_create(
                    username=uid,
                    defaults={
                        'email': email,
                        'first_name': first_name,
                        'last_name': last_name,
                        'is_active': True
                    }
                )
                
                # Create user profile
                UserProfile.objects.create(
                    user=user,
                    firebase_uid=uid,
                    email=email,
                    first_name=first_name,
                    last_name=last_name
                )
            
            return (user, None)
            
        except auth.InvalidIdTokenError:
            raise exceptions.AuthenticationFailed('Invalid ID token')
        except auth.ExpiredIdTokenError:
            raise exceptions.AuthenticationFailed('Expired ID token')
        except auth.RevokedIdTokenError:
            raise exceptions.AuthenticationFailed('Revoked ID token')
        except auth.CertificateFetchError:
            raise exceptions.AuthenticationFailed('Could not fetch certificates')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Authentication error: {str(e)}')