import scrapy
import json
from pbl.items import ShopCard

class SpidereuroSpider(scrapy.Spider):
    name = 'spiderEuro'
    allowed_domains = ['www.trobos.lt']
    start_urls = []
    for page in range(1,82):
        url=f'https://trobos.lt/prekes?vendor=eurovaistine&page={page}'
        start_urls.append(url)
    item = []
    list = [{
        'sid': 15,
        'name': 'Samsung',
        'domain': 'https://www.eurovaistine.lt/',
        'imageurl': 'https://www.eurovaistine.lt/build/themes/ev/eurovaistine-theme/images/app/logo.png',
        'product': item
        }]

    def __init__(self):
        self.declare_xpath()

    def declare_xpath(self):
        self.getAllItemsXpath =  '//*[@id="category"]/div/div[1]/div/div[3]/div[4]/div/div/div/div/div/a/@href'
        self.TitleXpath  = '//*[@id="product"]/section[1]/div[3]/section/div[2]/h1/text()'    
        self.PriceXpath = '//*[@id="product"]/section[1]/div[3]/section/div[2]/div[1]/div/div[1]/div/div[1]/span/text()'

    def parse(self, response):
        for href in response.xpath(self.getAllItemsXpath):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url=url,callback=self.parse_main_item, dont_filter=True)
     
    def parse_main_item(self,response): 
        shop = ShopCard()
        Title = response.xpath(self.TitleXpath).extract_first()
        Link = response.url
        Image = 'https://cdns.iconmonstr.com/wp-content/releases/preview/2019/240/iconmonstr-product-3.png'
        Price = response.xpath(self.PriceXpath).extract_first()
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
        with open("spiderEuro.json", "w") as final:
            json.dump(self.list, final, indent=2, ensure_ascii=False)