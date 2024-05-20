# Generated by Django 5.0.4 on 2024-05-17 03:48

import shortuuid.main
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_remove_message_receiver_alter_chatroom_id_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatroom',
            name='id',
            field=models.CharField(default=shortuuid.main.ShortUUID.uuid, max_length=128, primary_key=True, serialize=False, unique=True),
        ),
        migrations.CreateModel(
            name='Freinds',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('friend', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
