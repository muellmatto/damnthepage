from django.db import models

from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from taggit.models import TaggedItemBase
from taggit.managers import TaggableManager

from wagtail.admin.edit_handlers import StreamFieldPanel, FieldPanel
from wagtail.core.models import Page
from wagtail.core.fields import StreamField
from wagtail.core import blocks
from wagtail.documents.blocks import DocumentChooserBlock
from wagtail.embeds.blocks import EmbedBlock
from wagtail.search import index

from wagtail.snippets.models import register_snippet

from wagtailmedia.blocks import AudioChooserBlock, VideoChooserBlock


class ContentTag(TaggedItemBase):
    content_object = ParentalKey('home.Post', on_delete=models.CASCADE, related_name='tagged_items')


@register_snippet
class Post(ClusterableModel):
    title = models.CharField(max_length=255, primary_key=True)
    tags = TaggableManager(through=ContentTag, blank=True)
    content = StreamField(
        [
            ('richtext', blocks.RichTextBlock()),
            ('audio', AudioChooserBlock()),
            ('video', VideoChooserBlock()),
            ('embedded', EmbedBlock()),
            ('file', DocumentChooserBlock())
        ]
    ) 
    panel = [
        StreamFieldPanel('content'),
        FieldPanel('tags'),
        FieldPanel('title')
    ]
    search_fields = [
        index.SearchField('content', partial_match=True)
    ]
    def __str__(self):
        return self.title


class WebPage(Page):
    subpage_types = []
    parent_page_types = ['home.HomePage']
    content = StreamField(
        [
            ('richtext', blocks.RichTextBlock()),
            ('audio', AudioChooserBlock()),
            ('video', VideoChooserBlock()),
            ('html', blocks.RawHTMLBlock()),
            ('embedded', EmbedBlock()),
            ('file', DocumentChooserBlock())
        ],
        blank=True
    )

    content_panels = Page.content_panels + [
        StreamFieldPanel('content'),
    ]

    search_fields = Page.search_fields + [
        index.SearchField('content')
    ]


class HomePage(Page):
    """ this is the starting point """
    subpage_types = ['home.WebPage']
    max_count = 1
    def get_context(self, request, *args, **kwargs):
        context = super().get_context(request, *args, **kwargs)
        if tag := request.GET.get('tag', None):
            context['active_tag'] = tag
            context['posts'] = Post.objects.all().filter(tags__slug__in=[tag]) 
        else:
            context['posts'] = Post.objects.all()
        context['tags'] = {item.tag for item in ContentTag.objects.all()}
        return context
