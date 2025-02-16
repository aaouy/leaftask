from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("user/register/", views.UserCreate.as_view(), name="user_view_create"),
    path("user/delete/", views.UserDelete.as_view(), name="user_delete"),
    path("task/", views.TaskListCreate.as_view(), name="create_task"),
    path("task/delete/<int:pk>/", views.TaskDestroy.as_view(), name="delete_task"),
    path("task/update/<int:pk>/", views.TaskUpdate.as_view(), name="task_update"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("list-auth/", include("rest_framework.urls")),
]


