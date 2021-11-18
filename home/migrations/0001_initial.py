# Generated by Django 3.2.9 on 2021-11-17 23:25

from django.db import migrations, models
import django.db.models.deletion
import modelcluster.fields
import taggit.managers
import wagtail.core.blocks
import wagtail.core.fields
import wagtail.documents.blocks
import wagtail.embeds.blocks
import wagtailmedia.blocks


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('taggit', '0003_taggeditem_add_unique_index'),
        ('wagtailcore', '0066_collection_management_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContentTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='HomePage',
            fields=[
                ('page_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='wagtailcore.page')),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
        migrations.CreateModel(
            name='WebPage',
            fields=[
                ('page_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='wagtailcore.page')),
                ('content', wagtail.core.fields.StreamField([('richtext', wagtail.core.blocks.RichTextBlock()), ('audio', wagtailmedia.blocks.AudioChooserBlock()), ('video', wagtailmedia.blocks.VideoChooserBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('embedded', wagtail.embeds.blocks.EmbedBlock()), ('file', wagtail.documents.blocks.DocumentChooserBlock())], blank=True)),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('title', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('content', wagtail.core.fields.StreamField([('richtext', wagtail.core.blocks.RichTextBlock()), ('audio', wagtailmedia.blocks.AudioChooserBlock()), ('video', wagtailmedia.blocks.VideoChooserBlock()), ('embedded', wagtail.embeds.blocks.EmbedBlock()), ('file', wagtail.documents.blocks.DocumentChooserBlock())])),
                ('tags', taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', through='home.ContentTag', to='taggit.Tag', verbose_name='Tags')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='contenttag',
            name='content_object',
            field=modelcluster.fields.ParentalKey(on_delete=django.db.models.deletion.CASCADE, related_name='tagged_items', to='home.post'),
        ),
        migrations.AddField(
            model_name='contenttag',
            name='tag',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='home_contenttag_items', to='taggit.tag'),
        ),
    ]
