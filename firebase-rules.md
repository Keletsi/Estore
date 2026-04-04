// Firebase Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Product collection - anyone can read, only admins can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User collection - users can read, only own user can write their profile
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Order collection - only authenticated users can read/write their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if false;
    }
  }
}

// Firebase Storage Security Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - anyone can read, only admins can upload
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024 // 5MB max
                   && get(/databases/$(bucket)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}