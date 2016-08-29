# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='result',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.CharField(max_length=32, null=True)),
                ('level', models.IntegerField(null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='task',
            fields=[
                ('task_id', models.CharField(max_length=10, serialize=False, primary_key=True)),
                ('language', models.CharField(max_length=16)),
                ('task_type', models.CharField(max_length=16)),
                ('status', models.CharField(max_length=16)),
                ('code', models.TextField(null=True)),
                ('create_time', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='task_steps',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('step_desc', models.CharField(max_length=256, null=True)),
                ('additional_info', models.CharField(max_length=256, null=True)),
                ('task', models.ForeignKey(to='home.task')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='result',
            name='task',
            field=models.ForeignKey(to='home.task'),
            preserve_default=True,
        ),
    ]
