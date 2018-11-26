import logging
import re
import os
import sys
import mysql
from selenium import webdriver
from urllib.parse import urldefrag, urljoin
from collections import deque
from bs4 import BeautifulSoup
import mysql.connector
from dotenv import load_dotenv, find_dotenv

class SeleniumCrawler(object):

    def __init__(self, base_url, exclusion_list, start_url=None):

        assert isinstance(exclusion_list, list), 'Exclusion list - needs to be a list'

        chromeOptions = webdriver.ChromeOptions()
        prefs = {'profile.managed_default_content_settings.images':2}
        chromeOptions.add_experimental_option("prefs", prefs)
        chromeOptions.add_argument('--headless')

        self.browser = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver", chrome_options=chromeOptions)  #Add path to your Chromedriver

        self.base = base_url

        self.start = start_url if start_url else base_url  #If no start URL is passed use the base_url

        self.exclusions = exclusion_list  #List of URL patterns we want to exclude

        self.crawled_urls = []  #List to keep track of URLs we have already visited

        self.url_queue = deque([self.start])  #Add the start URL to our list of URLs to crawl



    def get_page(self, url):
        try:
            self.browser.get(url)
            return self.browser.page_source
        except Exception as e:
            logging.exception(e)
            return

    def get_soup(self, html):
        if html is not None:
            soup = BeautifulSoup(html, 'lxml')
            return soup
        else:
            return

    def get_links(self, soup):

        for link in soup.find_all('a', href=True):
            link = link['href']
            if any(e in link for e in self.exclusions):
                continue
            url = urljoin(self.base, urldefrag(link)[0])
            if url not in self.url_queue and url not in self.crawled_urls:
                if url.startswith(self.base):
                        self.url_queue.append(url)

    def get_data(self, soup):
        data = {}
        try:
            string1 = ""
            plist1 = soup.findAll('a', {'class': 'crumb'}, title=True)[1:]
            for i in plist1:
                s = str(i).split(" title=")[1].split(">")[0][1:]
                s = s[:-1]
                string1 += s +","
            string1 = string1[:-1]
            data['category'] = string1
        except:
            data['category'] = None

        try:
            data['title'] =  soup.find('h1', {'class': 'page-title'}).get_text().strip().replace('\n','')
        except:
            data['title'] = None

        try:
            data['brand'] =  soup.find('p', {'class': 'page-title-info'}).get_text().strip().replace('\n','')
        except:
            data['brand'] = None

        try:
            data['price'] = float(soup.find('span', {'class': 'ultra-bold'}).get_text().strip().replace('\n','').replace('~','').replace('€','').replace(',', '.'))
        except:
            data['price'] = None

        try:
            plist = [p.get_text() for p in soup.find_all("p", text=True)]
            data['description'] = plist[3]

            data['id'] = int(re.sub("\D", "", plist[4]))
        except:
            data['description'] = None
            data['id'] = None
        return data


    def txt_output(self, url, data):

        with open('output.txt', 'a', encoding='utf-8') as outputfile:
            outputfile.write("Product Id: %s \n" % data['id'])
            outputfile.write("Title: %s \n" % data['title'])
            outputfile.write("Brand: %s \n" % data['brand'])
            outputfile.write("Category: %s \n" % data['category'])
            outputfile.write("Price: %s \n" % data['price'])
            outputfile.write("Description: %s \n \n" % data['description'])

    def add_to_DB(self, url, data, count):
            sql = "INSERT INTO Product (Product_Id, Name, Brand, Category, Price, Description) VALUES (%s, %s, %s, %s, %s, %s)"
            val = (data['id'], data['title'], data['brand'], data['category'], data['price'], data['description'])
            cursor.execute(sql, val)
            #print("Inserted Product:{0}, {1}, {2}, {3}, {4}, {5} into database".format(data['id'], data['brand'], data['category'], data['title'], data['price'], data['description']))
            db.commit()
            cursor.execute("""
            SELECT * FROM Product;
            """)
            cursor.fetchall()
            rc = cursor.rowcount
            print()
            print("Your database now has {0} products".format(rc))
            if(rc == count):
                print("Exiting...")
                db.close()
                sys.exit()

    def run_crawler(self, count):
        while len(self.url_queue): #If we have URLs to crawl - we crawl
            current_url = self.url_queue.popleft() #We grab a URL from the left of the list
            self.crawled_urls.append(current_url) #We then add this URL to our crawled list
            html = self.get_page(current_url)
            if self.browser.current_url != current_url: #If the end URL is different from requested URL - add URL to crawled list
                self.crawled_urls.append(current_url)

            m = re.search(r'/p/\d\d\d\d\d\d\d', current_url)
            # Check if current_url is a product
            if m is not None:
                soup = self.get_soup(html)
                if soup is not None:
                    self.get_links(soup)
                    data = self.get_data(soup)
                    self.txt_output(current_url, data)
                    self.add_to_DB(current_url, data, count)
            else:
                soup = self.get_soup(html)
                if soup is not None:
                    self.get_links(soup)


if __name__ == '__main__':


    load_dotenv(find_dotenv())

    db = mysql.connector.connect(user= os.getenv("DB_USER"), password=os.getenv("DB_PASS"), host=os.getenv("DB_HOST"), database=os.getenv("DB_NAME"))

    print('Connection to Database {0} established succesfully!'.format(os.getenv("DB_NAME")))

    cursor=db.cursor()
    #create database
    cursor.execute("""CREATE DATABASE IF NOT EXISTS {0}""".format(os.getenv("DB_NAME")))
    #use database
    cursor.execute("""USE {0}""".format(os.getenv("DB_NAME")))
    db.commit()
    #create Product table
    cursor.execute("""CREATE TABLE IF NOT EXISTS Product(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Product_Id INT,
        Name VARCHAR(255),
        Brand VARCHAR(255),
        Category TEXT,
        Price FLOAT,
        Description TEXT
        )""")
    db.commit()
    print("Table Product created succesfully!")
    print()
    print("It may take a while until Products will begin to add to your database.")
    print("This happens because non product urls are parsed first by the program.")
    print()
    print("If you wan to see the urls beeing parsed comment out the line 'chromeOptions.add_argument('--headless')' at the beginning of the declaration of the SeleniumCrawler Object.")
    # Allow utf8 for greek text
    sql = """
    ALTER DATABASE {0} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ALTER TABLE Product CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;""".format(os.getenv("DB_NAME"))
    cursor.execute(sql, multi=True)

    a = SeleniumCrawler('https://www.ab.gr/', ['?','signin'])

    PRODUCTS_TO_ADD = 1000
    a.run_crawler(PRODUCTS_TO_ADD)

    cursor.execute("""
    SELECT * FROM Product;
    """)
    cursor.fetchall()
    rc = cursor.rowcount
    print()
    print("Your database now has {0} products".format(rc))
    db.close()
