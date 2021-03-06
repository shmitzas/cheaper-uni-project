import scrapy
from pbl.items import ShopCard
import json

class SpiderelektroSpider(scrapy.Spider):
    name = 'spiderAvitela'
    allowed_domains = ['avitela.lt']
    start_urls = ['http://avitela.lt/']
    item = []
    list = [{
        'sid': 2,
        'name': 'Avitela',
        'domain': 'https://avitela.lt/',
        'imageurl': 'https://avitela.lt/assets/img/avitela-ukraine.svg',
        'product': item
        }]

    def __init__(self):
        self.declare_xpath()

        #All the XPaths the spider needs to know go here
    def declare_xpath(self):
        self.getAllCategoriesXpath = '/html/body/div[1]/div[2]/div[1]/header/div[4]/div[2]/div[2]/div[1]/div/div/div/div/ul/li/a/@href'
        self.getAllSubCategoriesXpath = '/html/body/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/a/@href'
        self.getAllSubSubCategoriesXpath = '/html/body/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/a/@href'
        self.getAllItemsXpath = '/html/body/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/a/@href'
        self.TitleXpath  = '/html/body/div[1]/div[2]/div[1]/div[6]/div[2]/div[2]/div/div[1]/div/div/div/div[1]/div/div/div/div[1]/h1/text()'
        self.ImageXpath = '/html/body/div[1]/div[1]/div[1]/div[6]/div[2]/div[2]/div/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/div[1]/div/div/div[1]/div/div[3]/div/a/img/@src'
        self.PriceXpath = '/html/body/div[1]/div[2]/div[1]/div[6]/div[2]/div[2]/div/div[1]/div/div/div/div[1]/div/div/div/div[2]/div[2]/div[1]/div[2]/span/span/text()'

    def parse(self, response):
        for href in response.xpath(self.getAllCategoriesXpath):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url=url,callback=self.parse_subcategory, dont_filter=True)
    
    def parse_subcategory(self, response):
        if response.xpath(self.getAllSubCategoriesXpath):
            for href in response.xpath(self.getAllSubCategoriesXpath):
                url = response.urljoin(href.extract())
                yield scrapy.Request(url=url,callback=self.parse_sub_subcategory, dont_filter=True)
        else: 
            self.parse_items

    def parse_sub_subcategory(self, response):
        if response.xpath(self.getAllSubSubCategoriesXpath):
            for href in response.xpath(self.getAllSubSubCategoriesXpath):
                url = response.urljoin(href.extract())
                yield scrapy.Request(url=url,callback=self.parse_items, dont_filter=True)
        else: 
            self.parse_items

    def parse_items(self,response):
        for href in response.xpath(self.getAllItemsXpath):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url,callback=self.parse_main_item)
        
        next_page = [response.url + '?page='+str(x)+'' for x in range(1,40)]
        for page in next_page:
            url = page
            yield scrapy.Request(url, callback=self.parse)

    def parse_main_item(self,response):

        Title = response.xpath(self.TitleXpath).extract_first()
        Link = response.url

        if response.xpath(self.ImageXpath).extract_first() is None:
            Image = response.xpath('//*[@id="image"]/@src').extract_first()
            
        else:
            Image = 'https://avitela.lt/assets/img/avitela-ukraine.svg'

        if response.xpath(self.PriceXpath).extract_first() is None:
            Price = response.xpath('/html/body/div[1]/div[2]/div[1]/div[6]/div[2]/div[2]/div/div[1]/div/div/div/div[1]/div/div/div/div[2]/div[2]/div[1]/div[1]/span/span/text()').extract_first()
        else:
            Price = response.xpath(self.PriceXpath).extract_first()

        shop = ShopCard()

        Title = response.xpath(self.TitleXpath).extract_first()
        Link = response.url
        Image = response.xpath(self.ImageXpath).extract_first()
        Price = Price.replace(',', '.')
        Price = float(Price.split(' ')[0])
        
        shop['item'] = {
                'title': Title,
                'link': Link,
                'image': Image,
                'price': Price
            }

        self.item.append(shop['item'])

    def closed(self, reason):
        with open("spiderAvitela.json", "w") as final:
            json.dump(self.list, final, indent=2, ensure_ascii=False)