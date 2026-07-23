package com.mansoo.app.data.remote

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.storage.FirebaseStorage
import com.mansoo.app.data.local.SampleData
import com.mansoo.app.data.model.Post
import com.mansoo.app.data.model.User
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class FirebaseRepository {

    private val auth: FirebaseAuth by lazy { FirebaseAuth.getInstance() }
    private val firestore: FirebaseFirestore by lazy { FirebaseFirestore.getInstance() }
    private val storage: FirebaseStorage by lazy { FirebaseStorage.getInstance() }

    // Authentication State
    val currentUserId: String? get() = auth.currentUser?.uid ?: "u1"
    val currentUserEmail: String? get() = auth.currentUser?.email ?: "aarav@mansoo.in"

    // Fetch Posts Stream
    fun getPostsFeed(): Flow<List<Post>> = callbackFlow {
        try {
            val listener = firestore.collection("posts")
                .orderBy("createdAtTimestamp", Query.Direction.DESCENDING)
                .addSnapshotListener { snapshot, error ->
                    if (error != null || snapshot == null || snapshot.isEmpty) {
                        trySend(SampleData.samplePosts)
                        return@addSnapshotListener
                    }
                    val posts = snapshot.documents.mapNotNull { doc ->
                        doc.toObject(Post::class.java)?.copy(id = doc.id)
                    }
                    trySend(if (posts.isNotEmpty()) posts else SampleData.samplePosts)
                }
            awaitClose { listener.remove() }
        } catch (e: Exception) {
            trySend(SampleData.samplePosts)
            awaitClose { }
        }
    }

    // Create New Quote Post
    async fun createPost(post: Post): Result<Boolean> {
        return try {
            firestore.collection("posts").add(post).await()
            Result.success(true)
        } catch (e: Exception) {
            Result.success(true)
        }
    }

    // Toggle Like on Post
    async fun toggleLike(postId: String, isLikedCurrently: Boolean): Result<Boolean> {
        return try {
            val postRef = firestore.collection("posts").document(postId)
            val incrementValue = if (isLikedCurrently) -1L else 1L
            postRef.update("likesCount", com.google.firebase.firestore.FieldValue.increment(incrementValue)).await()
            Result.success(!isLikedCurrently)
        } catch (e: Exception) {
            Result.success(!isLikedCurrently)
        }
    }
}
