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
    "likes": 707,
    "comments": 19,
    "localImage": "fotos/DfTQQT-OWM0.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/877871843_18111679082225626_5080085001654146026_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeFb4T9U-0AQzGPY-IvOvxATYr6vM6KkTgJivq8zoqROAuB4fNHIy6a6dMFD5qqbSI4C_VbKut_uSRhP-M-RMhiG&_nc_ohc=u8BCLuyvMT4Q7kNvwHlYmLI&_nc_oc=Adq7q8zwQoEA7v4G5LRuerTpvrrrHAR0nbxK2IAo5R-padYWSXbUTPUoxb-eZrGKDvo&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQTGAaHGN7haLijn8z2TnDfrVYtGH5S6KJWp23QHrhG0VQ&oe=6AF15ECD",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTRB7DOhP5/",
    "shortcode": "DfTRB7DOhP5",
    "name": "MAITTE OPAZO",
    "likes": 402,
    "comments": 32,
    "localImage": "fotos/DfTRB7DOhP5.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/881734903_18111681386225626_6805858121759279100_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=100&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeFPtNql2eM24XQjlNxkasJ4veqERtSs0Ri96oRG1KzRGG1e9fFseZYlpUk5Lot-HYy9snUZhOC_VmbvXPVAu5P9&_nc_ohc=AFlBtw-6xMsQ7kNvwHVR_SP&_nc_oc=AdqN2FhCkJ4vLdiZci6Kkcd_tSv5LIIkmPFWHQo-5Y8I9mHURaVceZRXtn-PjY1pKEk&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQQD-QwU-yoQXkhX0V5t0vCwrSWh_kDPOg2aMnDSnWMTlg&oe=6AF15CA7",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQwh-u8jD/",
    "shortcode": "DfTQwh-u8jD",
    "name": "EMILIA FRITSCH",
    "likes": 211,
    "comments": 8,
    "localImage": "fotos/DfTQwh-u8jD.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/877997680_18111680249225626_6820305427116194204_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeGLAyf4lNy3FqHqtQK_P2CDTC14zhIpXDBMLXjOEilcMIG50aPbGTHuKaSiZp_EnTHL_fBIivaSarYNP2jifGD2&_nc_ohc=ROtZnD8D-UUQ7kNvwH5LDEQ&_nc_oc=AdoI9JAzrZCVpsTNRgdQZr6TZivZyIUa4mfJ744C9jRDNWLuxXzcWMQ3cnyGi3jSMig&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQTWvg54YV8yczGnnH9-jbYYVkimDcmrjju_HyG0QLV6OA&oe=6AF15C72",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQZ4BuX8u/",
    "shortcode": "DfTQZ4BuX8u",
    "name": "ROSA HARO",
    "likes": 196,
    "comments": 14,
    "localImage": "fotos/DfTQZ4BuX8u.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/880298442_18111679364225626_564301447218284457_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeENYQivFeMR3sMnP0AhoneUYaoqW7Co3lphqipbsKjeWjfabnCINxwfGrCku3DuDQw2RBiNw_jVU23CXN0rNI7O&_nc_ohc=Dodx3z9ELEMQ7kNvwFShmbW&_nc_oc=Ado1wf-8DT9rjHWEt5OGmI_te4sh4f2UV0oEMLH3WDWbVKqX4LsFJxxsKGV2KcwnaYE&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQS6TAV5HYnhsnGAQVN7Rfxft915htMzFt8MFaYK45Eb8A&oe=6AF184EC",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQzO9O8bc/",
    "shortcode": "DfTQzO9O8bc",
    "name": "ISIADORA LEIVA",
    "likes": 165,
    "comments": 13,
    "localImage": "fotos/DfTQzO9O8bc.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/878071330_18111680432225626_8578720432529001968_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=110&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHgwWsw9MRhC3rfGT55Jm_uM9TVH9aTLbYz1NUf1pMttgu0kRYqRXKi76o-3N9uG5JRGzU-W-_dtk5JwyJAB1LY&_nc_ohc=T2F-5HEOS6AQ7kNvwGAJo3v&_nc_oc=AdoFJ8IL0_XlwLafJm-yzmv0IGujU5b79FHEpb_syPKXr8dHPgJNtB0wBwcTNI3KnT8&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQRI7dLVOab3gxeO7ZnrAX-OcvWLCugvpeMxr1gaT-7qsw&oe=6AF17143",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQ173OYef/",
    "shortcode": "DfTQ173OYef",
    "name": "LEONOR GONZALEZ",
    "likes": 147,
    "comments": 0,
    "localImage": "fotos/DfTQ173OYef.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/881397152_18111680612225626_8437341379529765589_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeFwIhP3eLfT9pz1bw1boCc3HN0MrjZUpvQc3QyuNlSm9M1KHKga7gvFXEdZ_xnXRCu5BGSRsXTM6dbK3u7D9kI9&_nc_ohc=GC2eaeWD0uwQ7kNvwFpG5J_&_nc_oc=AdpfNHnGLzEUAJ0IbhXJa8Z2dnloJ7qJ0v9ovnlHg-_4Nr8xgW5XzJYEPKfCE_J-s14&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQRqPNhP0v4-0U3eiDEs895cDlhMlOaGjQCyUCKKlx-cRw&oe=6AF17813",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQqfYOlUD/",
    "shortcode": "DfTQqfYOlUD",
    "name": "ESTEFANI CARCAMO",
    "likes": 135,
    "comments": 0,
    "localImage": "fotos/DfTQqfYOlUD.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/877085481_18111679934225626_407009044236014132_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeF-4Ilriv10_a_VjKmZSmwI2tSQlrVwtUHa1JCWtXC1QarNSHADNEUIhX9UfilsDf7IvMGs3XqF1bPojEqbRL3t&_nc_ohc=owqDX215yp0Q7kNvwGxoECd&_nc_oc=AdojqxwZhv-M04qlMgUOVLwPF3LLVc-SaxAeelz_B9kyqM-xeXuLbbIIpGR5kmNv3ic&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQQRj7hkbL-W64CISINYeEBOzd1Y9TZfkCTOnzpqV8_rFQ&oe=6AF1580B",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQT1eOlfE/",
    "shortcode": "DfTQT1eOlfE",
    "name": "FERNANDA GALLARDO",
    "likes": 121,
    "comments": 2,
    "localImage": "fotos/DfTQT1eOlfE.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/887420454_18111679160225626_5520438649397908692_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=110&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeE_ZVnYpalQfi22SvspbhXgufcZSaa_t7e59xlJpr-3tz_hnRZKFCKlzszA0_ziv3EzDTNE552hObUpu4f2gpmd&_nc_ohc=J198pSn2DAIQ7kNvwH2moMD&_nc_oc=Adr45SbIFTZznifp1OkxaraS5gC14YLJsQ5IeurBP17CGLT4vlGyItH5Q8qKEr3GRzk&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQRdcOUDNEKIpfmsbhY0Inv6IDg9HBvX_xMaht0lxeAviw&oe=6AF15220",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQtpwumd2/",
    "shortcode": "DfTQtpwumd2",
    "name": "EMILIA BORQUEZ",
    "likes": 110,
    "comments": 2,
    "localImage": "fotos/DfTQtpwumd2.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/879812826_18111680120225626_7355138057864586240_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeF8QQd2VMkKPFIE9RRbXTl8YB4yp0D-YbtgHjKnQP5huzSDtb3bEatIsQwKmIDai5Lijmj1VZB64DQnEC7VSuMw&_nc_ohc=h2CIhn_NmUcQ7kNvwHiTQ0B&_nc_oc=AdoOqJAD_a1wvNxXDupt0Gw5BN8NQRKFjEiVfDEyAG9eMavr3ZuOxHdZAq3PGUTrk9s&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQSeYC5vITaW50Bg9skJWvkVnfdd9fLzSOfAu5VOtXuPng&oe=6AF16032",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQ4VWOgnQ/",
    "shortcode": "DfTQ4VWOgnQ",
    "name": "LUCIA SOTO",
    "likes": 85,
    "comments": 3,
    "localImage": "fotos/DfTQ4VWOgnQ.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/879492747_18111680873225626_7063854793494980043_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeEgb1l36mnpOcuh5CdKk8_IJQAb4szDu58lABvizMO7n0Yhy61utGVdatJxhWt4EyKTPGe8bW18CL-GFjeKPo5C&_nc_ohc=x8tx-sPr0ZAQ7kNvwEYimiW&_nc_oc=Adp-WYA4Zusy6euFUc5bstYhk_5D1YaK5cpo_Q6IvUBpeE7NICd06Us-F6u3Hw7qKhQ&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQT7B4cel0yIKYIr05XWP7TPSa13bkL-wTr4KAQHs3gy4A&oe=6AF169D0",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQlOMuffA/",
    "shortcode": "DfTQlOMuffA",
    "name": "JAVIERA ACUÑA Y DAYHARY PEREZ",
    "likes": 66,
    "comments": 1,
    "localImage": "fotos/DfTQlOMuffA.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/881275809_18111679760225626_8194197080698418446_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHp_usc5O0WtgEawZHMtZXc8xLqPAWTtYjzEuo8BZO1iB3V2biMne16h-LEAbuV_bI2-WiVthL8JNZHIT_UtybX&_nc_ohc=114wv0q3tzAQ7kNvwHrux_m&_nc_oc=Adog4g23Bm6ZHaH4VwGr1y1zxp2n9WXKygeC_hty7XziP6ItPDUifxwcm32IpGrLwZs&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQSAyCz5KALUHjGaNwdfymdShrJ_M5EuOa5NFjmdbSvuTg&oe=6AF1606F",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQ_Yku8UC/",
    "shortcode": "DfTQ_Yku8UC",
    "name": "PALOMA ALVARADO",
    "likes": 60,
    "comments": 0,
    "localImage": "fotos/DfTQ_Yku8UC.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/881397122_18111681308225626_7617339540415236616_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeFk78kEzFU_oVV3dGBdrUsyZjqgwBPDnM1mOqDAE8OczWqNH0Rf6-hBe6t341tLig47oMf-Ticd9cTXbiGXwU6z&_nc_ohc=3VAlH6SpHCgQ7kNvwGfzknZ&_nc_oc=Adr97G7p4Hj-GreUKoYUVRi00q0EqjIPlFw2IelcEGk_L2kOPe6vv6mc30v347oIJG4&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQRM74lXBsWgqcI1_siSL-GIvQLH0Hn6M7uiPYpMBzBOXg&oe=6AF17B1E",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQ7cLOoRa/",
    "shortcode": "DfTQ7cLOoRa",
    "name": "ISADORA MARTINEZ",
    "likes": 44,
    "comments": 2,
    "localImage": "fotos/DfTQ7cLOoRa.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/884185819_18111681038225626_8593983946790393715_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHPBgG-ib2T4yEl9x8wMwC3PE9XTxdNP8Y8T1dPF00_xvn0nNLftjElE6eBTao1Nb6by3qZz0Z5wgWWr6xQeVgN&_nc_ohc=zviidomzgV0Q7kNvwHE4qS7&_nc_oc=AdoWHmli0quoiupgD_ZihWFccBiEfHV4bqEru5DALOgAXtmEaOyV_n2F9foGivKHxXg&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQQ-K1cinTmAtjhUN8wzCs7NfQ4AC2d3KxV0tCCMLw7TyA&oe=6AF1860E",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQnVYuKlp/",
    "shortcode": "DfTQnVYuKlp",
    "name": "VICTOR VEGA",
    "likes": 41,
    "comments": 1,
    "localImage": "fotos/DfTQnVYuKlp.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/885805741_18111679832225626_7184602266287547065_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHzQGZ-luwaJe4rZYxo_RZ48P96A5bh0D7w_3oDluHQPlC43AFd5S8E2YcyPCpsT392EZ_dBATretHmTSid3-h0&_nc_ohc=jKn-77akWP0Q7kNvwEhPay7&_nc_oc=AdqhwO4qtDqcfsFehFe0sKwZ5DEB972OuEqjo79LMh--sAAdEHlvZr3qk2psgSJOrsA&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQR7lfbs2107tCiqlsViY4N3ypr81LG0m1us1vkn94efsQ&oe=6AF187A1",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQe-NOAZX/",
    "shortcode": "DfTQe-NOAZX",
    "name": "GIANELLA MONSALVE",
    "likes": 23,
    "comments": 0,
    "localImage": "fotos/DfTQe-NOAZX.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/882420439_18111679526225626_8562605275173711060_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeGy90hqgmM_raOxrnicLOesCXACCMUZRA4JcAIIxRlEDuAIbxIY-nU0yiN_IoIISV68oRyENTPQe3U-bERStS5-&_nc_ohc=lYEGedr5aR8Q7kNvwG1YqjA&_nc_oc=AdqjuNjvWLEQjyIyMnXylJl3Hkxq1TaJofUpwoa5TbLvYOs6z3tTkvyZhiIzPpQt0cQ&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQSQ8Bra2kg9yBvfabKcWvzT0LYhffNt5b2XmhBXlsiBDw&oe=6AF1515E",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQcjBu1HN/",
    "shortcode": "DfTQcjBu1HN",
    "name": "KEVIN DOMKE Y MATILDA ESPINOZA",
    "likes": 23,
    "comments": 5,
    "localImage": "fotos/DfTQcjBu1HN.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/877085493_18111679451225626_1408869458445635570_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeH82pS5I2Ttiih7cjWk0mmegC_p5RYJfCCAL-nlFgl8IPtFpePkKZ4q-TEIw9gKXUue_sWRbzsuLFJjija2Edl7&_nc_ohc=qz20RHN5xQoQ7kNvwGSlTjo&_nc_oc=AdrN_vM_jbFUeBkMptxMl55qHxzuE0OFop6qHL9vx1C4WvpARM1oW0bBulJ1WR61bJE&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQToYPEFHWg-D6qWNrEib8f-rG1GtlI3bIHgPrxtnxM0_Q&oe=6AF154B6",
    "success": true
  },
  {
    "url": "https://www.instagram.com/p/DfTQie5Onwa/",
    "shortcode": "DfTQie5Onwa",
    "name": "DAMARYS ALVAREZ",
    "likes": 7,
    "comments": 2,
    "localImage": "fotos/DfTQie5Onwa.jpg",
    "image": "https://scontent-scl3-1.cdninstagram.com/v/t51.82787-15/880208894_18111679637225626_7314924502880922168_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_eui2=AeHOlbd0eBpvG4yOoRONU2WUHWj-ALJaSC8daP4AslpIL_SNv9QCnm5NxxTuBzcuk3jU4QDbrTEtjCawVe4NRpxo&_nc_ohc=8y-9RuAPPycQ7kNvwFPX1Oa&_nc_oc=AdqntWcboAbb0Y9AXtTKkm7NEOVUqh8_Jc9uxABE_9yDfGwAfO25E48OtSLOrcBA040&_nc_zt=23&_nc_ht=scontent-scl3-1.cdninstagram.com&edm=AFF3FJ0EAAAA&_nc_gid=k7uJbwH1pEMmjVf43BNrGA&oh=00_AQR2pvdmP5dEsnv26cOFGpduC5gNiJUupp30I4d8p8t0Yg&oe=6AF15F5B",
    "success": true
  }
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
          '<div class="podium-likes">' + formatNumber(item.likes) + '</div>' +
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
            '<div class="contestant-likes">' + formatNumber(item.likes) + ' <span>likes</span></div>' +
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

