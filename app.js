const puppeteer = require('puppeteer')

const getReviewCount = async (type, url) => {
  let count = []

  switch (type) {
    case 'google':
      count = await getGoogleReviewCount(url) 
      break;
    case 'facebook':
      count = await getFacebookReviewCount(url)
      break;
    case 'tripadvisor':
      count = await getTripadvisorReviewCount(url)
      break;
    case 'yelp':
      count = await getYelpReviewCount(url)
      break;
    case'grubhub':
      reviews = await getGrubhubReviewCount(url)
      break;
    default:
      console.log('Error: invalid review type specified')
  }

  return count
}

const getGoogleReviewCount = async (url) => {
  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  await page.setDefaultNavigationTimeout(100000)
  await page.goto(url)
  await page.waitForSelector('.HHrUdb')

  let count = await page.$eval('.HHrUdb', el => el.innerHTML)

  await browser.close()

  return parseInt(count)
}

const getReviews = async (type, url) => {
  let reviews = []

  switch (type) {
    case 'google':
      reviews = await getGoogleReviews(url) 
      break;
    case 'facebook':
      reviews = await getFacebookReviews(url)
      break;
    case 'tripadvisor':
      reviews = await getTripadvisorReviews(url)
      break;
    case 'yelp':
      reviews = await getYelpReviews(url)
      break;
    case'grubhub':
      reviews = await getGrubhubReviews(url)
      break;
    default:
      console.log('Error: invalid review type specified')
  }

  return reviews
}

const getGoogleReviews = async (url) => {
  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  await page.setDefaultNavigationTimeout(100000)
  await page.goto(url)
  await page.waitForSelector('.HHrUdb')
  await page.click('.HHrUdb')
  await page.waitForSelector('.jftiEf')
  await scrollPage(page, '.dS8AEf')
  await waitFor(3000);

  const reviews = await page.$$eval('.jftiEf', reviews => {
    return reviews.map(review => {
      return {
        author: review.querySelector('.d4r55')?.textContent.trim(),
        rating: parseFloat(review.querySelector('.kvMYJc')?.getAttribute('aria-label')),
        text: review.querySelector('.wiI7pd')?.textContent.trim(),
        date: review.querySelector(".rsqaWe")?.textContent.trim()
      }
    })
  })
  
  await browser.close()
  return reviews
}

// Copied from serpapi
async function scrollPage(page, scrollContainer) {
  let lastHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);
  while (true) {
    await page.evaluate(`document.querySelector("${scrollContainer}").scrollTo(0, document.querySelector("${scrollContainer}").scrollHeight)`);
    await page.waitForTimeout(2000);
    let newHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);
    if (newHeight === lastHeight) {
      break;
    }
    lastHeight = newHeight;
  }
}
const waitFor = (ms) => new Promise(res => setTimeout(res, ms));

const main = async () => {
  let testCount = await getReviewCount('google', 'https://www.google.com/maps/place/The+Den+-+Arcade+%2B+Drinkery/@49.2874834,-123.1295549,15z/data=!4m5!3m4!1s0x0:0xf73a1ab6a74ab155!8m2!3d49.2874834!4d-123.1295549')
  console.log(testCount)
  let testReviews = await getReviews('google', 'https://www.google.com/maps/place/The+Den+-+Arcade+%2B+Drinkery/@49.2874834,-123.1295549,15z/data=!4m5!3m4!1s0x0:0xf73a1ab6a74ab155!8m2!3d49.2874834!4d-123.1295549')
  console.log(testReviews)
}
main()


module.exports = { getReviews, getReviewCount }