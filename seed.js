// File for seeding profile data, login data, and
import bcrypt from 'bcrypt'
import { closeConnection, UserModel, ListingModel } from "./db.js"

// Array of users for data seeding
const users = [
    {
        "firstName": "Adam",
        "lastName": "Andrews",
        "email": "adam@email.com",
        "password": await bcrypt.hash("fishing", 8),
        "role": "Recruitment Manager",
        "department": "Human Resources",
        "admin": true,
        "aboutMe": {text: "I am a manager of the recruitment team", careerDevelopment: "I am keen to experience all areas of Human Resources", skills: ["Project Management","Strategy","Leadership"]},
        "imageRef": "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&h=350",
    },
    {
        "firstName": "Betty",
        "lastName": "Bailey",
        "email": "betty@email.com",
        "password": await bcrypt.hash("castle", 8),
        "role": "Human Resources Specialist",
        "department": "Human Resources",
        "admin": false,
        "aboutMe": {text: "I am a Human Resources Specialist, looking after onboarding and training", careerDevelopment: "I aspire to be Learning and Development manager", skills: ["Leadership", "Training"]},
        "imageRef": "https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&h=350"

    },
    {
        "firstName": "Charlie",
        "lastName": "Castleton",
        "email": "charlie@email.com",
        "password": await bcrypt.hash("empire", 8),
        "role": "Software Engineer",
        "department": "IT",
        "admin": false,
        "aboutMe": {text: "I am a Software Engineer, having been recently promoted from Junior Software Engineer", careerDevelopment: "My long term plan is to be Head of IT", skills: ["Project Management","Strategy","Analytical"]},
        "imageRef": "https://images.pexels.com/photos/3727513/pexels-photo-3727513.jpeg?auto=compress&cs=tinysrgb&h=350",
    },
    {
        "firstName": "David",
        "lastName": "Denley",
        "email": "david@email.com",
        "password": await bcrypt.hash("cavalier", 8),
        "role": "Product Manager",
        "department": "Production",
        "admin": false,
        "aboutMe": {text: "I am a Product Manager and I manage a team of Product Developers", careerDevelopment: "Having gained extensive experience in the overseas market, I am keen to develop my skills within the local Production team", skills: ["Leadership","Design","Quality Assurance"]},
        "imageRef": "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&h=350",

    },
    {
        "firstName": "Adam",
        "lastName": "Hunter",
        "email": "adamh@email.com",
        "password": await bcrypt.hash("butterfly", 8),
        "role": "Developer",
        "department": "IT",
        "admin": false,
        "aboutMe": {text: "I am a developer", careerDevelopment: "I want to be a senior developer", skills: ["Strategy","Analytical","Training"]},
        "imageRef": "https://images.pexels.com/photos/9071718/pexels-photo-9071718.jpeg?auto=compress&cs=tinysrgb&h=350",
    }

]

// Delete all documents in collection related to UserModel
await UserModel.deleteMany()


// Insert user documents into collection using previously defined array (users)
let dbUsers = await UserModel.insertMany(users)


// Array of listings for data seeding
const listings = [
    {
        "title": "Web Developer",
        "description": {
            "points": ["Updating and maintenance of all aspects of web site",
            "Extensive knowledge of web technologies including HTML, Javascript and also web frameworks (e.g. React, NodeJS)",
            "Full stack web development with experience in database management"],
            "text": "As a Web Developer, you will play a crucial role in designing, developing, and maintaining our website and web applications to ensure a seamless user experience and drive business objectives. You'll collaborate with cross-functional teams to translate business requirements into functional, user-friendly web solutions while staying abreast of emerging technologies and industry best practices."
        },
        "department": "IT",
        "location": "Hybrid",
        "salary": "100000",
        "roleType": "Full-time",
        "roleDuration": "Contract",
        "datePosted": "2024-02-10",
        "dateClosing": "2024-02-29",
        "applicants": [dbUsers[2]],
        "listingActive": true,
        "creator" :  dbUsers[0]
    },
    {
        "title": "Marketing Manager",
        "description": {
            "points": ["Marketing Strategy Implementation",
                "Managing ecom and digital marketing teams",
                "Develop compelling marketing collateral, messaging, and content "],
            "text": "As a Marketing Manager, you will play a key role in developing and implementing comprehensive marketing strategies to promote our products/services, enhance brand awareness, and generate leads. You'll lead a team of marketing professionals, collaborate with cross-functional teams, and leverage a mix of online and offline channels to achieve our marketing objectives while staying aligned with company goals and values."
        },
        "department": "Marketing",
        "location": "Hybrid",
        "roleType": "Full-time",
        "roleDuration": "Permanent",
        "salary": "125000",
        "datePosted": "2024-04-10",
        "dateClosing": "2024-04-29",
        "applicants": [dbUsers[3], dbUsers[2]],
        "listingActive": true,
        "creator" : dbUsers[0]
    },
    {
        "title": "Data Analyst",
        "description": {
            "points": ["Proven experience as a Data Analyst or similar role.",
            "Strong proficiency in data manipulation and analysis tools such as SQL, R, Python and Excel Power BI.",
            "Excellent communication skills, capable of presenting complex data in an understandable format."],
            "text": "As a Data Analyst, you will be instrumental in analyzing our vast data sets to identify trends, patterns, and insights that impact our business outcomes. Your expertise will enable us to understand market dynamics, optimize processes, and improve product offerings. You will work closely with various departments, providing actionable insights that drive data-driven decisions."
        },
        "department": "Strategy",
        "location": "On Site",
        "roleType": "Full-time",
        "roleDuration": "Parental Leave",
        "salary": "90000",
        "datePosted": "2024-01-05",
        "dateClosing": "2024-01-20",
        "applicants": [dbUsers[3]],
        "listingActive": true,
        "creator" : dbUsers[0]
    },
    {
        "title": "Administrator",
        "description": {
            "points": ["Great opportunity to join the data team", "Develop new processes", "Collaborate with internal and external teams"],
            "text": "The successful candidate will provide administrative support, greet and direct visitors and answer and respond to calls and emails. Qualified candidates will have impeccable verbal and written communication skills, a strong ability to multitask and a friendly demeanour."
        },
        "department": "Data",
        "location": "On Site",
        "salary": "70000",
        "roleType": "Full-time",
        "roleDuration": "Permanent",
        "datePosted": "2024-02-24",
        "dateClosing": "2024-03-04",
        "listingActive": false,
        "creator": dbUsers[0]
    },
    {
        "title": "Social Media Coordinator",
        "description": {
            "points": ["Develop and execute a comprehensive social media strategy aligned with company goals",
            "Create engaging and relevant content for social media platforms, including Instagram and TikTok",
            "Cultivate relationships with influencers and industry thought leaders"],
            "text": "We are passionate about growing our brand to its highest potential, and we're seeking a talented Social Media Coordinator to help us expand our online presence and engage with our audience across various social media platforms. As a Social Media Coordinator, you will play a pivotal role in executing our social media strategy to drive brand awareness, engagement, and ultimately, business growth. You'll be responsible for creating compelling content, managing social media accounts, analyzing performance metrics, and staying up-to-date with industry trends to maximize our impact in the digital sphere. You'll have the opportunity to make a meaningful impact in a collaborative and supportive work environment with ample opportunities for professional growth and development."
        },
        "department": "Marketing",
        "location": "Hybrid",
        "salary": "65000",
        "roleType": "Part-time",
        "roleDuration": "Contract",
        "datePosted": "2024-04-24",
        "dateClosing": "2024-05-15",
        "listingActive": true,
        "creator": dbUsers[0]
    },
    {
        "title": "National Trainer",
        "description": {
            "points": ["Training new starters and organising away days",
            "Identifying new processes and procedures",
            "Coordinating and presenting at team events"],
            "text": "A great opportunity to join the HR team in a newly created role responsible for training and development of all team members."
        },
        "department": "Human Resources",
        "location": "Other",
        "salary": "105000",
        "roleType": "Part-time",
        "roleDuration": "Permanent",
        "datePosted": "2024-04-24",
        "dateClosing": "2024-05-22",
        "listingActive": true,
        "creator": dbUsers[0]
    },
    {
        "title": "Admin Manager",
        "description": {
            "points": ["Overseeing all aspects of administration",
            "Managing a team of administrators and data entry clerks",
            "Presenting monthly reports on the efficiency and output of Data and Analytics"],
            "text": "The successful candidate will manage and guide the administrative support function. Training new team members in the nuances and workings of the department."
        },
        "department": "Data",
        "location": "Hybrid",
        "salary": "95000",
        "roleType": "Full-time",
        "roleDuration": "Permanent",
        "datePosted": "2024-04-26",
        "dateClosing": "2024-05-31",
        "listingActive": false,
        "creator": dbUsers[0]
    },
    {
        "title": "IT Helpdesk",
        "description": {
            "points": ["Managing user queries including setting up new accounts",
            "Database maintenance",
            "Some after hours support required"],
            "text": "This role would be suitable for an IT or Computer Science graduate or a trainee looking for a step up. Accuracy and keen attention to detail are required. The ability to problem solve, work independently on quickly changing priorities is essential."
        },
        "department": "IT",
        "location": "On Site",
        "salary": "75000",
        "roleType": "Full-time",
        "roleDuration": "Permanent",
        "datePosted": "2024-04-28",
        "dateClosing": "2024-05-20",
        "listingActive": true,
        "creator": dbUsers[0]
    },
]
// Delete all documents in collection related to ListingModel
await ListingModel.deleteMany()


// Insert listing documents into collection using previously defined array (listings)
await ListingModel.insertMany(listings)

dbUsers = await UserModel.find({});
const dbListings = await ListingModel.find({});

// Log both listings and users to console
console.log("Users and Listings seeded")

// Add applications to user's data
const applications = [
    {
        "user" : dbUsers[2],
        "listing" : dbListings[0]
    },
    {
        "user" : dbUsers[2],
        "listing" : dbListings[1]
    },
    {
        "user" : dbUsers[3],
        "listing" : dbListings[1]
    },
    {
        "user" : dbUsers[3],
        "listing" : dbListings[2]
    }
]


for (let application of applications) {
    let userID = application.user._id.toString();
    let listingID = application.listing._id.toString();

    await UserModel.findByIdAndUpdate(userID, {applications: [listingID]})
}

console.log("Applications added to Users")

// Manually close connection to database when finished seeding
closeConnection()