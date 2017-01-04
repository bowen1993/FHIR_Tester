from django.conf.urls import include, url
from django.contrib import admin
from account import views

urlpatterns = [
    url(r'^login$', views.login),
    url(r'^register$', views.register),
    url(r'^logout$', views.logout),
]