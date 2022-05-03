# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from itemloaders.processors import TakeFirst

class PblSpider(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    Title =     scrapy.Field(output_processor=TakeFirst())
    Price =     scrapy.Field(output_processor=TakeFirst())
    sub_price = scrapy.Field(output_processor=TakeFirst())
    Image =     scrapy.Field(output_processor=TakeFirst())
    Link =      scrapy.Field(output_processor=TakeFirst())

    pass
