from django.conf.urls import include, url
from django.contrib import admin
from home import views

urlpatterns = [
    url(r'^submit$', views.submit_task),
    url(r'^history$', views.get_user_task_history),
    url(r'^addServer$', views.add_new_server),
    url(r'^servers$', views.get_all_servers),
    url(r'^search$', views.search_task),
    url(r'^resources$', views.get_resources),
    url(r'^rmatrix$', views.get_resource_matrix),
    url(r'^times$', views.all_test_time),
]