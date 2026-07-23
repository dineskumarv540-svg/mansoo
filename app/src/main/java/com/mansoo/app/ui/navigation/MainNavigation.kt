package com.mansoo.app.ui.navigation

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.mansoo.app.ui.screens.categories.CategoryScreen
import com.mansoo.app.ui.screens.create.CreatePostScreen
import com.mansoo.app.ui.screens.explore.ExploreScreen
import com.mansoo.app.ui.screens.home.HomeScreen
import com.mansoo.app.ui.screens.login.LoginScreen
import com.mansoo.app.ui.screens.notifications.NotificationsScreen
import com.mansoo.app.ui.screens.profile.ProfileScreen
import com.mansoo.app.ui.screens.splash.SplashScreen
import com.mansoo.app.ui.theme.GradientEnd
import com.mansoo.app.ui.theme.GradientStart
import com.mansoo.app.ui.theme.PrimaryPink
import com.mansoo.app.ui.viewmodel.MainViewModel

// ── Shared slide transition specs ───────────────────────────
private const val TRANSITION_MS = 300

private val slideEnter: AnimatedContentTransitionScope<*>.() -> EnterTransition = {
    slideInHorizontally(
        initialOffsetX = { fullWidth -> fullWidth },
        animationSpec  = tween(TRANSITION_MS)
    ) + fadeIn(tween(TRANSITION_MS))
}

private val slideExit: AnimatedContentTransitionScope<*>.() -> ExitTransition = {
    slideOutHorizontally(
        targetOffsetX = { fullWidth -> -fullWidth / 3 },
        animationSpec = tween(TRANSITION_MS)
    ) + fadeOut(tween(TRANSITION_MS))
}

private val slidePopEnter: AnimatedContentTransitionScope<*>.() -> EnterTransition = {
    slideInHorizontally(
        initialOffsetX = { fullWidth -> -fullWidth / 3 },
        animationSpec  = tween(TRANSITION_MS)
    ) + fadeIn(tween(TRANSITION_MS))
}

private val slidePopExit: AnimatedContentTransitionScope<*>.() -> ExitTransition = {
    slideOutHorizontally(
        targetOffsetX = { fullWidth -> fullWidth },
        animationSpec = tween(TRANSITION_MS)
    ) + fadeOut(tween(TRANSITION_MS))
}

private val fadeExit: AnimatedContentTransitionScope<*>.() -> ExitTransition = {
    fadeOut(tween(400))
}


sealed class Screen(val route: String, val title: String, val activeIcon: ImageVector, val inactiveIcon: ImageVector) {
    object Splash        : Screen("splash",        "Splash",        Icons.Filled.Star,          Icons.Outlined.Star)
    object Login         : Screen("login",         "Login",         Icons.Filled.Person,         Icons.Outlined.Person)
    object Home          : Screen("home",           "Home",          Icons.Filled.Home,           Icons.Outlined.Home)
    object Explore       : Screen("explore",        "Search",        Icons.Filled.Search,         Icons.Outlined.Search)
    object Create        : Screen("create",         "Create",        Icons.Filled.Add,            Icons.Outlined.Add)
    object Favorites     : Screen("favorites",      "Favorites",     Icons.Filled.Favorite,       Icons.Outlined.FavoriteBorder)
    object Profile       : Screen("profile",        "Profile",       Icons.Filled.Person,         Icons.Outlined.Person)
    object Notifications : Screen("notifications",  "Notifications", Icons.Filled.Notifications,  Icons.Outlined.Notifications)
}

@Composable
fun MainAppNavigation(viewModel: MainViewModel) {
    val navController = rememberNavController()

    val posts by viewModel.postsFeed.collectAsState()
    val stories by viewModel.stories.collectAsState()
    val suggestedUsers by viewModel.suggestedUsers.collectAsState()
    val categories by viewModel.categories.collectAsState()
    val selectedHashtag by viewModel.selectedHashtag.collectAsState()
    val notifications by viewModel.notifications.collectAsState()

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            if (currentRoute != Screen.Splash.route && currentRoute != Screen.Login.route) {
                BottomNavigationBar(navController = navController)
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            NavHost(
                navController    = navController,
                startDestination = Screen.Splash.route,
                enterTransition  = slideEnter,
                exitTransition   = slideExit,
                popEnterTransition  = slidePopEnter,
                popExitTransition   = slidePopExit
            ) {
                // Splash — fade exit, navigates to Login
                composable(
                    route          = Screen.Splash.route,
                    exitTransition = fadeExit
                ) {
                    SplashScreen(
                        onSplashFinished = {
                            navController.navigate(Screen.Login.route) {
                                popUpTo(Screen.Splash.route) { inclusive = true }
                            }
                        }
                    )
                }

                // Login — slide in, navigates to Home on success
                composable(Screen.Login.route) {
                    LoginScreen(
                        onLoginSuccess   = {
                            navController.navigate(Screen.Home.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        },
                        onGoogleSignIn   = {
                            navController.navigate(Screen.Home.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        },
                        onNavigateSignup = { /* TODO: signup screen */ }
                    )
                }
                composable(Screen.Home.route) {
                    HomeScreen(
                        posts            = posts,
                        stories          = stories,
                        suggestedUsers   = suggestedUsers,
                        onOpenNotifications = { navController.navigate(Screen.Notifications.route) }
                    )
                }
                composable(Screen.Explore.route) {
                    ExploreScreen(
                        posts            = posts,
                        selectedHashtag  = selectedHashtag,
                        onHashtagSelected = { viewModel.selectHashtag(it) }
                    )
                }
                composable(Screen.Create.route) {
                    CreatePostScreen(
                        onPostCreated = { newPost ->
                            viewModel.addPost(newPost)
                            navController.navigate(Screen.Home.route)
                        }
                    )
                }
                composable(Screen.Favorites.route) {
                    CategoryScreen(categories = categories)
                }
                composable(Screen.Profile.route) {
                    ProfileScreen(posts = posts)
                }
                composable(Screen.Notifications.route) {
                    NotificationsScreen(notifications = notifications)
                }
            }
        }
    }
}

@Composable
fun BottomNavigationBar(navController: NavHostController) {
    val items = listOf(
        Screen.Home,
        Screen.Explore,
        Screen.Create,
        Screen.Favorites,
        Screen.Profile
    )

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        items.forEach { screen ->
            val isSelected = currentRoute == screen.route

            if (screen == Screen.Create) {
                // Highlighted Center "+" Button with gradient
                NavigationBarItem(
                    selected = isSelected,
                    onClick = { navController.navigate(screen.route) },
                    icon = {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(56.dp)
                                .background(
                                    brush = Brush.linearGradient(
                                        colors = listOf(GradientStart, GradientEnd)
                                    ),
                                    shape = CircleShape
                                )
                        ) {
                            Icon(
                                imageVector = Icons.Filled.Add,
                                contentDescription = "Create Post",
                                tint = Color.White,
                                modifier = Modifier.size(30.dp)
                            )
                        }
                    },
                    label = { Text(screen.title, fontSize = 11.sp, color = PrimaryPink) },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = Color.Transparent
                    )
                )
            } else {
                NavigationBarItem(
                    selected = isSelected,
                    onClick = {
                        if (currentRoute != screen.route) {
                            navController.navigate(screen.route) {
                                popUpTo(Screen.Home.route) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    },
                    icon = {
                        Icon(
                            imageVector = if (isSelected) screen.activeIcon else screen.inactiveIcon,
                            contentDescription = screen.title,
                            tint = if (isSelected) PrimaryPink else Color.Gray
                        )
                    },
                    label = {
                        Text(
                            text = screen.title,
                            fontSize = 11.sp,
                            color = if (isSelected) PrimaryPink else Color.Gray
                        )
                    }
                )
            }
        }
    }
}
