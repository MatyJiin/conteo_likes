(function() {
  var previousLikesMap = {};
  var countdown = 15;
  var countdownTimer = null;

  // Datos base garantizados oficiales desde Meta API
  var fallbackData = [
  {
    "url": "https://www.instagram.com/p/DfTQQT-OWM0/",
    "shortcode": "DfTQQT-OWM0",
    "name": "RENATA ARRIAGADA",
    "igLikes": 1534,
    "fbLikes": 0,
    "totalVotes": 1534,
    "likes": 1534,
    "comments": 23,
    "localImage": "fotos/DfTQQT-OWM0.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/877871843_18111679082225626_5080085001654146026_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeFb4T9U-0AQzGPY-IvOvxATYr6vM6KkTgJivq8zoqROAuB4fNHIy6a6dMFD5qqbSI4C_VbKut_uSRhP-M-RMhiG&_nc_ohc=u8BCLuyvMT4Q7kNvwHlYmLI&_nc_oc=Adq7q8zwQoEA7v4G5LRuerTpvrrrHAR0nbxK2IAo5R-padYWSXbUTPUoxb-eZrGKDvo&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQSGvR_73wgeSRM53Ir8CEd1rWP_Pp2_TlGl-J3c2yc0yA&oe=6AF23FCD",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTRB7DOhP5/",
    "shortcode": "DfTRB7DOhP5",
    "name": "MAITTE OPAZO",
    "igLikes": 592,
    "fbLikes": 0,
    "totalVotes": 592,
    "likes": 592,
    "comments": 43,
    "localImage": "fotos/DfTRB7DOhP5.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/881734903_18111681386225626_6805858121759279100_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=100&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeFPtNql2eM24XQjlNxkasJ4veqERtSs0Ri96oRG1KzRGG1e9fFseZYlpUk5Lot-HYy9snUZhOC_VmbvXPVAu5P9&_nc_ohc=AFlBtw-6xMsQ7kNvwHVR_SP&_nc_oc=AdqN2FhCkJ4vLdiZci6Kkcd_tSv5LIIkmPFWHQo-5Y8I9mHURaVceZRXtn-PjY1pKEk&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQQRmNNWKqq1Fkz3geCJ2sz2LN2QR-uBeS2rOxKBXNA9Bw&oe=6AF23DA7",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQzO9O8bc/",
    "shortcode": "DfTQzO9O8bc",
    "name": "ISIADORA LEIVA",
    "igLikes": 327,
    "fbLikes": 0,
    "totalVotes": 327,
    "likes": 327,
    "comments": 20,
    "localImage": "fotos/DfTQzO9O8bc.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/878071330_18111680432225626_8578720432529001968_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=110&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHgwWsw9MRhC3rfGT55Jm_uM9TVH9aTLbYz1NUf1pMttgu0kRYqRXKi76o-3N9uG5JRGzU-W-_dtk5JwyJAB1LY&_nc_ohc=T2F-5HEOS6AQ7kNvwGAJo3v&_nc_oc=AdoFJ8IL0_XlwLafJm-yzmv0IGujU5b79FHEpb_syPKXr8dHPgJNtB0wBwcTNI3KnT8&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQQkbY7deGlgKjDJeth3_MQA0HfQLR_mAVzwIo69glQwfw&oe=6AF25243",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQwh-u8jD/",
    "shortcode": "DfTQwh-u8jD",
    "name": "EMILIA FRITSCH",
    "igLikes": 236,
    "fbLikes": 0,
    "totalVotes": 236,
    "likes": 236,
    "comments": 9,
    "localImage": "fotos/DfTQwh-u8jD.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/877997680_18111680249225626_6820305427116194204_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeGLAyf4lNy3FqHqtQK_P2CDTC14zhIpXDBMLXjOEilcMIG50aPbGTHuKaSiZp_EnTHL_fBIivaSarYNP2jifGD2&_nc_ohc=ROtZnD8D-UUQ7kNvwH5LDEQ&_nc_oc=AdoI9JAzrZCVpsTNRgdQZr6TZivZyIUa4mfJ744C9jRDNWLuxXzcWMQ3cnyGi3jSMig&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQQAg31332l9LvDj2FZU_DbT6rvt3WcEkdHKff_D1U4tjA&oe=6AF23D72",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQZ4BuX8u/",
    "shortcode": "DfTQZ4BuX8u",
    "name": "ROSA HARO",
    "igLikes": 236,
    "fbLikes": 0,
    "totalVotes": 236,
    "likes": 236,
    "comments": 18,
    "localImage": "fotos/DfTQZ4BuX8u.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/880298442_18111679364225626_564301447218284457_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeENYQivFeMR3sMnP0AhoneUYaoqW7Co3lphqipbsKjeWjfabnCINxwfGrCku3DuDQw2RBiNw_jVU23CXN0rNI7O&_nc_ohc=1FUBTxiHB3UQ7kNvwH1ddux&_nc_oc=Adr5MOwsPZpeGhsMUTMJRx0a1NCYlJKq8dUkTai1iLoRVVX5WD8Y7jaSEsVaITHrQ4c&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQSSFEmYDfZVkwrGQ_gFY5jEWa6i3eL3H5WOSKhhZZ0zog&oe=6AF265EC",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQqfYOlUD/",
    "shortcode": "DfTQqfYOlUD",
    "name": "ESTEFANI CARCAMO",
    "igLikes": 199,
    "fbLikes": 0,
    "totalVotes": 199,
    "likes": 199,
    "comments": 0,
    "localImage": "fotos/DfTQqfYOlUD.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/877085481_18111679934225626_407009044236014132_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeF-4Ilriv10_a_VjKmZSmwI2tSQlrVwtUHa1JCWtXC1QarNSHADNEUIhX9UfilsDf7IvMGs3XqF1bPojEqbRL3t&_nc_ohc=owqDX215yp0Q7kNvwGxoECd&_nc_oc=AdojqxwZhv-M04qlMgUOVLwPF3LLVc-SaxAeelz_B9kyqM-xeXuLbbIIpGR5kmNv3ic&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQTRB9xRQYnTS6sYtJWGDNKMbhrKrP8mTb8Q6Hs0YheqcQ&oe=6AF2390B",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQ173OYef/",
    "shortcode": "DfTQ173OYef",
    "name": "LEONOR GONZALEZ",
    "igLikes": 188,
    "fbLikes": 0,
    "totalVotes": 188,
    "likes": 188,
    "comments": 0,
    "localImage": "fotos/DfTQ173OYef.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/881397152_18111680612225626_8437341379529765589_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeFwIhP3eLfT9pz1bw1boCc3HN0MrjZUpvQc3QyuNlSm9M1KHKga7gvFXEdZ_xnXRCu5BGSRsXTM6dbK3u7D9kI9&_nc_ohc=GC2eaeWD0uwQ7kNvwFpG5J_&_nc_oc=AdpfNHnGLzEUAJ0IbhXJa8Z2dnloJ7qJ0v9ovnlHg-_4Nr8xgW5XzJYEPKfCE_J-s14&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQR8HbbRTEYHMZDF3MTbjzbkZM-4hE7ofiUUl__P3AHZ5A&oe=6AF25913",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQ_Yku8UC/",
    "shortcode": "DfTQ_Yku8UC",
    "name": "PALOMA ALVARADO",
    "igLikes": 162,
    "fbLikes": 0,
    "totalVotes": 162,
    "likes": 162,
    "comments": 6,
    "localImage": "fotos/DfTQ_Yku8UC.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/881397122_18111681308225626_7617339540415236616_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeFk78kEzFU_oVV3dGBdrUsyZjqgwBPDnM1mOqDAE8OczWqNH0Rf6-hBe6t341tLig47oMf-Ticd9cTXbiGXwU6z&_nc_ohc=3VAlH6SpHCgQ7kNvwGfzknZ&_nc_oc=Adr97G7p4Hj-GreUKoYUVRi00q0EqjIPlFw2IelcEGk_L2kOPe6vv6mc30v347oIJG4&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQScB5rL3vSSAAfI3DGMjK7UdcK98jHLTyhHj2Xlu0ZGJA&oe=6AF25C1E",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQ7cLOoRa/",
    "shortcode": "DfTQ7cLOoRa",
    "name": "ISADORA MARTINEZ",
    "igLikes": 154,
    "fbLikes": 0,
    "totalVotes": 154,
    "likes": 154,
    "comments": 10,
    "localImage": "fotos/DfTQ7cLOoRa.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/884185819_18111681038225626_8593983946790393715_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHPBgG-ib2T4yEl9x8wMwC3PE9XTxdNP8Y8T1dPF00_xvn0nNLftjElE6eBTao1Nb6by3qZz0Z5wgWWr6xQeVgN&_nc_ohc=ZHQ4-PgthbIQ7kNvwFmQvAO&_nc_oc=AdpRqwRHup0Zq_6QmuFUHggSCMLpUXg9Poj3FVaULQj9ZpdX6UvpscSM9SXQ5LIymJ8&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQSYbZ72x_D1aOduNEAp_SWbgTEGlk3VQalnmoYjWIx-Ng&oe=6AF2670E",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQT1eOlfE/",
    "shortcode": "DfTQT1eOlfE",
    "name": "FERNANDA GALLARDO",
    "igLikes": 148,
    "fbLikes": 0,
    "totalVotes": 148,
    "likes": 148,
    "comments": 2,
    "localImage": "fotos/DfTQT1eOlfE.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/887420454_18111679160225626_5520438649397908692_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=110&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeE_ZVnYpalQfi22SvspbhXgufcZSaa_t7e59xlJpr-3tz_hnRZKFCKlzszA0_ziv3EzDTNE552hObUpu4f2gpmd&_nc_ohc=YNSwlHy_v-MQ7kNvwGIIfTG&_nc_oc=AdoMlYbPqnM1V47DAlQtSc00l8BIZskQoI9xbfEvpfFp6RvoG73OHnl0BoZApjPPQow&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQTHt40V4y6kS2ZpGbs9JCV34P2iHBFHn2vd6bp77WNjwQ&oe=6AF23320",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQlOMuffA/",
    "shortcode": "DfTQlOMuffA",
    "name": "JAVIERA ACUÑA Y DAYHARY PEREZ",
    "igLikes": 147,
    "fbLikes": 0,
    "totalVotes": 147,
    "likes": 147,
    "comments": 1,
    "localImage": "fotos/DfTQlOMuffA.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/881275809_18111679760225626_8194197080698418446_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHp_usc5O0WtgEawZHMtZXc8xLqPAWTtYjzEuo8BZO1iB3V2biMne16h-LEAbuV_bI2-WiVthL8JNZHIT_UtybX&_nc_ohc=114wv0q3tzAQ7kNvwHrux_m&_nc_oc=Adog4g23Bm6ZHaH4VwGr1y1zxp2n9WXKygeC_hty7XziP6ItPDUifxwcm32IpGrLwZs&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQSMs2rci9d5XlYeImocfOcSeEUB6x3vPg9Co1djEJHbwg&oe=6AF2416F",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQtpwumd2/",
    "shortcode": "DfTQtpwumd2",
    "name": "EMILIA BORQUEZ",
    "igLikes": 146,
    "fbLikes": 0,
    "totalVotes": 146,
    "likes": 146,
    "comments": 2,
    "localImage": "fotos/DfTQtpwumd2.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/879812826_18111680120225626_7355138057864586240_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeF8QQd2VMkKPFIE9RRbXTl8YB4yp0D-YbtgHjKnQP5huzSDtb3bEatIsQwKmIDai5Lijmj1VZB64DQnEC7VSuMw&_nc_ohc=h2CIhn_NmUcQ7kNvwHiTQ0B&_nc_oc=AdoOqJAD_a1wvNxXDupt0Gw5BN8NQRKFjEiVfDEyAG9eMavr3ZuOxHdZAq3PGUTrk9s&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQSBz0x_0yT93vbjqIJgwgBQktwda70kdlUuu7zePxiYlg&oe=6AF24132",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQe-NOAZX/",
    "shortcode": "DfTQe-NOAZX",
    "name": "GIANELLA MONSALVE",
    "igLikes": 132,
    "fbLikes": 0,
    "totalVotes": 132,
    "likes": 132,
    "comments": 3,
    "localImage": "fotos/DfTQe-NOAZX.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/882420439_18111679526225626_8562605275173711060_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeGy90hqgmM_raOxrnicLOesCXACCMUZRA4JcAIIxRlEDuAIbxIY-nU0yiN_IoIISV68oRyENTPQe3U-bERStS5-&_nc_ohc=lYEGedr5aR8Q7kNvwG1YqjA&_nc_oc=AdqjuNjvWLEQjyIyMnXylJl3Hkxq1TaJofUpwoa5TbLvYOs6z3tTkvyZhiIzPpQt0cQ&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQRb3dM6aOiovZmd_b8h20w7agOOiG8vmrmMWE4R6tTqWw&oe=6AF26A9E",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQnVYuKlp/",
    "shortcode": "DfTQnVYuKlp",
    "name": "VICTOR VEGA",
    "igLikes": 129,
    "fbLikes": 0,
    "totalVotes": 129,
    "likes": 129,
    "comments": 9,
    "localImage": "fotos/DfTQnVYuKlp.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/885805741_18111679832225626_7184602266287547065_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHzQGZ-luwaJe4rZYxo_RZ48P96A5bh0D7w_3oDluHQPlC43AFd5S8E2YcyPCpsT392EZ_dBATretHmTSid3-h0&_nc_ohc=jKn-77akWP0Q7kNvwEhPay7&_nc_oc=AdqhwO4qtDqcfsFehFe0sKwZ5DEB972OuEqjo79LMh--sAAdEHlvZr3qk2psgSJOrsA&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQTvBDOCdM2noUExNHmBkIChZNuqKTbz9J_j9OdQJmLVaQ&oe=6AF268A1",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQ4VWOgnQ/",
    "shortcode": "DfTQ4VWOgnQ",
    "name": "LUCIA SOTO",
    "igLikes": 107,
    "fbLikes": 0,
    "totalVotes": 107,
    "likes": 107,
    "comments": 4,
    "localImage": "fotos/DfTQ4VWOgnQ.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/879492747_18111680873225626_7063854793494980043_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeEgb1l36mnpOcuh5CdKk8_IJQAb4szDu58lABvizMO7n0Yhy61utGVdatJxhWt4EyKTPGe8bW18CL-GFjeKPo5C&_nc_ohc=x8tx-sPr0ZAQ7kNvwEYimiW&_nc_oc=Adp-WYA4Zusy6euFUc5bstYhk_5D1YaK5cpo_Q6IvUBpeE7NICd06Us-F6u3Hw7qKhQ&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQT5beUjxsS90qRrnxueuo8Sy-X8Qy2fGQ20tmeoh8ubfw&oe=6AF24AD0",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQcjBu1HN/",
    "shortcode": "DfTQcjBu1HN",
    "name": "KEVIN DOMKE Y MATILDA ESPINOZA",
    "igLikes": 63,
    "fbLikes": 0,
    "totalVotes": 63,
    "likes": 63,
    "comments": 5,
    "localImage": "fotos/DfTQcjBu1HN.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/877085493_18111679451225626_1408869458445635570_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeH82pS5I2Ttiih7cjWk0mmegC_p5RYJfCCAL-nlFgl8IPtFpePkKZ4q-TEIw9gKXUue_sWRbzsuLFJjija2Edl7&_nc_ohc=qz20RHN5xQoQ7kNvwGSlTjo&_nc_oc=AdrN_vM_jbFUeBkMptxMl55qHxzuE0OFop6qHL9vx1C4WvpARM1oW0bBulJ1WR61bJE&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQQ2smAEEflc0L3MmcEOcV4Y7C--SQl3Csx9XEhUyBeGOQ&oe=6AF235B6",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQie5Onwa/",
    "shortcode": "DfTQie5Onwa",
    "name": "DAMARYS ALVAREZ",
    "igLikes": 19,
    "fbLikes": 0,
    "totalVotes": 19,
    "likes": 19,
    "comments": 2,
    "localImage": "fotos/DfTQie5Onwa.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/880208894_18111679637225626_7314924502880922168_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHOlbd0eBpvG4yOoRONU2WUHWj-ALJaSC8daP4AslpIL_SNv9QCnm5NxxTuBzcuk3jU4QDbrTEtjCawVe4NRpxo&_nc_ohc=8y-9RuAPPycQ7kNvwFPX1Oa&_nc_oc=AdqntWcboAbb0Y9AXtTKkm7NEOVUqh8_Jc9uxABE_9yDfGwAfO25E48OtSLOrcBA040&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=mWCwM5JDLgPDZWK_2iyrEw&oh=00_AQTohVeJWWeHtdKgOHgtAO2Tx2jxkq5e0TAtOcEYzgFyAA&oe=6AF2405B",
    "success": true
  }
];

  function formatNumber(n) {
    return (n || 0).toLocaleString("es-CL");
  }

  function render(items) {
    if (!Array.isArray(items) || items.length === 0) return;

    items.sort(function(a, b) { return b.likes - a.likes; });

    var maxLikes = items[0].likes || 1;
    var totalLikes = 0;
    var totalIg = 0;
    var totalFb = 0;
    items.forEach(function(x) {
      totalLikes += (x.likes || 0);
      totalIg += (x.igLikes !== undefined ? x.igLikes : (x.likes || 0));
      totalFb += (x.fbLikes || 0);
    });

    var totalLikesEl = document.getElementById("statTotalLikes");
    if (totalLikesEl) totalLikesEl.textContent = formatNumber(totalLikes);

    var statIgEl = document.getElementById("statIgLikes");
    if (statIgEl) statIgEl.textContent = formatNumber(totalIg);

    var statFbEl = document.getElementById("statFbLikes");
    if (statFbEl) statFbEl.textContent = formatNumber(totalFb);

    var totalLikesEl = document.getElementById("statTotalLikes");
    if (totalLikesEl) totalLikesEl.textContent = formatNumber(totalLikes);

    // 1. Render Podio (Top 3)
    var pod = document.getElementById("podium");
    if (pod) {
      pod.innerHTML = "";
      var podiumConfig = [
        { idx: 1, class: "second", label: "🥈 2° Lugar" },
        { idx: 0, class: "first", label: "🥇 1° Lugar" },
        { idx: 2, class: "third", label: "🥉 3° Lugar" }
      ];

      podiumConfig.forEach(function(cfg) {
        var item = items[cfg.idx];
        if (!item) return;

        var card = document.createElement("div");
        card.className = "podium-card " + cfg.class;

        var imgSrc = item.localImage || ("fotos/" + item.shortcode + ".jpg") || item.image;
        var name = item.name || "PARTICIPANTE";

        card.innerHTML = 
          '<div class="podium-badge">' + cfg.label + '</div>' +
          '<div class="podium-img-wrapper">' +
            '<img class="podium-img" src="' + imgSrc + '" alt="' + name + '">' +
          '</div>' +
          '<div class="podium-name">' + name + '</div>' +
          '<div class="podium-likes">' + formatNumber(item.likes) + ' <span class="votos-sub">votos</span></div>' +
          ((item.fbLikes > 0) ? ('<div class="podium-breakdown">' +
            '<span class="badge-ig" title="Instagram">📸 ' + formatNumber(item.igLikes !== undefined ? item.igLikes : item.likes) + '</span>' +
            '<span class="badge-fb" title="Facebook">📘 ' + formatNumber(item.fbLikes) + '</span>' +
          '</div>') : '') +
          '<div class="podium-comments">' + item.comments + ' comentarios</div>' +
          '<a class="btn-ig" href="' + item.url + '" target="_blank">Ver publicación ↗</a>';

        pod.appendChild(card);
      });
    }

    // 2. Render Lista completa del 1 al 17
    var grid = document.getElementById("contestantsGrid");
    if (grid) {
      grid.innerHTML = "";

      items.forEach(function(item, index) {
        var rank = index + 1;
        var row = document.createElement("div");
        var rankClass = rank === 1 ? "top-1" : (rank === 2 ? "top-2" : (rank === 3 ? "top-3" : ""));
        row.className = "contestant-row " + rankClass;

        var prev = previousLikesMap[item.shortcode];
        if (prev !== undefined && item.likes > prev) {
          row.classList.add("bump");
        }
        previousLikesMap[item.shortcode] = item.likes;

        var imgSrc = item.localImage || ("fotos/" + item.shortcode + ".jpg") || item.image;
        var pct = Math.round((item.likes / maxLikes) * 100);
        var name = item.name || "PARTICIPANTE";

        row.innerHTML = 
          '<div class="rank-badge">#' + rank + '</div>' +
          '<img class="contestant-img" src="' + imgSrc + '" alt="' + name + '">' +
          '<div class="contestant-info">' +
            '<div class="contestant-title">' +
              name +
              '<span class="post-code">' + item.shortcode + '</span>' +
            '</div>' +
            '<div class="bar-container"><div class="bar-fill" style="width: ' + pct + '%"></div></div>' +
          '</div>' +
          '<div class="contestant-metrics">' +
            '<div class="contestant-likes">' + formatNumber(item.likes) + ' <span>votos</span></div>' +
            ((item.fbLikes > 0) ? ('<div class="vote-breakdown">' +
              '<span class="badge-ig" title="Instagram">📸 ' + formatNumber(item.igLikes !== undefined ? item.igLikes : item.likes) + '</span>' +
              '<span class="badge-fb" title="Facebook">📘 ' + formatNumber(item.fbLikes) + '</span>' +
            '</div>') : '') +
            '<div class="contestant-comments">' + item.comments + ' comentarios</div>' +
          '</div>' +
          '<a class="link-arrow" href="' + item.url + '" target="_blank" title="Abrir en Instagram">↗</a>';

        grid.appendChild(row);
      });
    }
  }

  function fetchLiveData() {
    fetch("/api/data?t=" + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(res) {
        var list = res.data || res;
        if (Array.isArray(list)) {
          render(list);
          if (res.lastUpdate) {
            var timeEl = document.getElementById("statTime");
            if (timeEl) timeEl.textContent = new Date(res.lastUpdate).toLocaleTimeString("es-CL");
          }
        }
      })
      .catch(function() {
        // Fallback para Vercel o archivo estático
        fetch("conteo_resultados.json?t=" + Date.now())
          .then(function(r) { return r.json(); })
          .then(function(items) { render(items); })
          .catch(function() {
            render(fallbackData);
          });
      });
  }

  var REFRESH_INTERVAL = 20;
  var countdown = REFRESH_INTERVAL;
  var countdownTimer = null;
  var isFetching = false;

  function fetchLiveData() {
    if (isFetching) return;
    isFetching = true;

    fetch("/api/data?t=" + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(res) {
        isFetching = false;
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          render(res.data);
          var timeEl = document.getElementById("statTime");
          if (timeEl) {
            var date = new Date(res.lastUpdate || Date.now());
            timeEl.textContent = date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          }
        }
      })
      .catch(function() {
        isFetching = false;
        fetch("conteo_resultados.json?t=" + Date.now())
          .then(function(r) { return r.json(); })
          .then(function(items) { render(items); })
          .catch(function() {
            render(fallbackData);
          });
      });
  }

  function startCountdown() {
    clearInterval(countdownTimer);
    countdown = REFRESH_INTERVAL;
    countdownTimer = setInterval(function() {
      // Si el usuario tiene la pestaña oculta, pausar el sondeo para ahorrar recursos
      if (document.hidden) return;

      countdown--;
      if (countdown <= 0) {
        countdown = REFRESH_INTERVAL;
        fetchLiveData();
      }
      var countEl = document.getElementById("statCountdown");
      if (countEl) countEl.textContent = "Próxima en " + countdown + "s";
    }, 1000);
  }

  // Reactivar de inmediato cuando el usuario vuelve a la pestaña
  document.addEventListener("visibilitychange", function() {
    if (!document.hidden && countdown > 5) {
      fetchLiveData();
    }
  });

  var btnRefresh = document.getElementById("btnRefresh");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", function() {
      if (btnRefresh.classList.contains("loading")) return;

      btnRefresh.classList.add("loading");
      var icon = document.getElementById("refreshIcon");
      var text = document.getElementById("refreshText");
      if (icon) icon.textContent = "⏳";
      if (text) text.textContent = "Actualizando...";

      fetch("/api/refresh")
        .catch(function() {})
        .then(function() {
          setTimeout(function() {
            fetchLiveData();
            btnRefresh.classList.remove("loading");
            if (icon) icon.textContent = "🔄";
            if (text) text.textContent = "Actualizar";
            startCountdown();
          }, 400);
        });
    });
  }

  // Render inicial
  render(fallbackData);
  fetchLiveData();
  startCountdown();
})();

