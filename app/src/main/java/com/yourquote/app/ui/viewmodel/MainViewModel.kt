package com.yourquote.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.yourquote.app.data.local.SampleData
import com.yourquote.app.data.model.Category
import com.yourquote.app.data.model.NotificationItem
import com.yourquote.app.data.model.Post
import com.yourquote.app.data.model.User
import com.yourquote.app.data.remote.FirebaseRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MainViewModel(
    private val repository: FirebaseRepository = FirebaseRepository()
) : ViewModel() {

    private val _postsFeed = MutableStateFlow<List<Post>>(SampleData.samplePosts)
    val postsFeed: StateFlow<List<Post>> = _postsFeed.asStateFlow()

    private val _stories = MutableStateFlow<List<User>>(SampleData.sampleStories)
    val stories: StateFlow<List<User>> = _stories.asStateFlow()

    private val _suggestedUsers = MutableStateFlow<List<User>>(SampleData.sampleUsers)
    val suggestedUsers: StateFlow<List<User>> = _suggestedUsers.asStateFlow()

    private val _categories = MutableStateFlow<List<Category>>(SampleData.sampleCategories)
    val categories: StateFlow<List<Category>> = _categories.asStateFlow()

    private val _notifications = MutableStateFlow<List<NotificationItem>>(SampleData.sampleNotifications)
    val notifications: StateFlow<List<NotificationItem>> = _notifications.asStateFlow()

    private val _selectedHashtag = MutableStateFlow<String>("#Trending")
    val selectedHashtag: StateFlow<String> = _selectedHashtag.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    init {
        fetchFeed()
    }

    fun fetchFeed() {
        viewModelScope.launch {
            repository.getPostsFeed().collect { posts ->
                if (posts.isNotEmpty()) {
                    _postsFeed.value = posts
                }
            }
        }
    }

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun selectHashtag(tag: String) {
        _selectedHashtag.value = tag
    }

    fun addPost(post: Post) {
        val updated = listOf(post) + _postsFeed.value
        _postsFeed.value = updated
        viewModelScope.launch {
            repository.createPost(post)
        }
    }
}
