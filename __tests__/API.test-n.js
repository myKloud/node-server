const mongoose = require("mongoose");
const app = require("../servertest");
const request = require("supertest");


describe("Test if the Jest work", () => {
  test("should  output 2 ", () => {
    expect(1 * 2).toBe(2);
  });

  it("should be 1 = 1 ", () => {
    expect(1).toBe(1);
  });
});


const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect("mongodb://localhost:27017/testing", options);
const articles = require("../db/models/articles")
const booking = require("../db/models/booking")
const comments = require("../db/models/comments")
const role = require("../db/models/role")
const user = require("../db/models/user")
const userdata = require("../db/models/userdata")

afterAll(async () => {
  await articles.remove();
  await booking.remove();
  await comments.remove();
  await role.remove();
  await user.remove();
  await userdata.remove();
  await mongoose.connection.close();
});


describe("Testing the module1", () => {
  beforeAll(async () => {
    await articles.remove();
  });
  afterEach(async () => {
    await articles.remove();
  });

  it("check if the model defined", () => {
    expect(articles).toBeDefined();
  });
  it("Should save a article", async () => {
    const articleInfo = {
    title:"title",
    description:"description",
    img:"img",
    };
    const newArticle = new articles(articleInfo);
    await newArticle.save();

    const checkArticle = await articles.findOne({ title:"title"});
    expect(checkArticle.title).toBe(articleInfo.title);
  });
});


describe("Testing the module2", () => {
  beforeAll(async () => {
    await booking.remove();
  });
  afterEach(async () => {
    await booking.remove();
  });

  
  it("check if the model defined", () => {
    expect(booking).toBeDefined();
  });
  it("Should save a booking", async () => {
    const bookingInfo = {
    vaccineName:"de",
    date:"1988-08-09",
    time:"10 AM",
    };
    const newBooking = new booking(bookingInfo);
    await newBooking.save();

    const checkBooking = await booking.findOne({ vaccineName:"de"});
    expect(checkBooking.vaccineName).toBe(bookingInfo.vaccineName);
  });
});



describe("Testing the module3", () => {
  beforeAll(async () => {
    await comments.remove();
  });
  afterEach(async () => {
    await comments.remove();
  });

  
  it("check if the model defined", () => {
    expect(comments).toBeDefined();
  });
  it("Should save a comments", async () => {
    const commentsInfo = {
      comment:"nice"
    };
    const newComments = new comments(commentsInfo);
    await newComments.save();

    const checkComments = await comments.findOne({ comment:"nice"});
    expect(checkComments.comment).toBe(commentsInfo.comment);
  });
});


describe("Testing the module4", () => {
  beforeAll(async () => {
    await role.remove();
  });
  afterEach(async () => {
    await role.remove();
  });

  
  it("check if the model defined", () => {
    expect(role).toBeDefined();
  });
  it("Should save a role", async () => {
    const roleInfo = {
      role:"admin" , 
      permissions : [1,2,3]
    };
    const newRole = new role(roleInfo);
    await newRole.save();

    const checkRole = await role.findOne({ role:"admin"});
    expect(checkRole.comment).toBe(roleInfo.comment);
  });
});



describe("Testing the module5", () => {
  beforeAll(async () => {
    await user.remove();
  });
  afterEach(async () => {
    await user.remove();
  });

  
  it("check if the model defined", () => {
    expect(user).toBeDefined();
  });
  it("Should save a user", async () => {
    const userInfo = {
      nationality:"JOR" , 
      id_number : 11 , 
      name: "deyaa",
      age: 24,
      email: "dd",
      password: "44d",
    };
    const newUser = new user(userInfo);
    await newUser.save();

    const checkUser = await user.findOne({ nationality:"JOR"});
    expect(checkUser.nationality).toBe(userInfo.nationality);
    expect(checkUser.id_number).toBe(userInfo.id_number);
    expect(checkUser.name).toBe(userInfo.name);
    expect(checkUser.age).toBe(userInfo.age);
  });
});


describe("Testing the module6", () => {
  beforeAll(async () => {
    await userdata.remove();
  });
  afterEach(async () => {
    await userdata.remove();
  });

  
  it("check if the model defined", () => {
    expect(userdata).toBeDefined();
  });
  it("Should save a userdata", async () => {
    const userdataInfo = {
      id_number : 11 , 
      name: "deyaa",
      age: 24,
    };
    const newUserdata = new userdata(userdataInfo);
    await newUserdata.save();

    const checkUserdata = await userdata.findOne({ name:"deyaa"});
    expect(checkUserdata.id_number).toBe(userdataInfo.id_number);
    expect(checkUserdata.name).toBe(userdataInfo.name);
    expect(checkUserdata.age).toBe(userdataInfo.age);
  });
});





describe("Testing article APIs", () => {

  const article = {
    title:"title",
    description:"description",
    img:"img",
    };
  it("Should be able to create a article", async() => {
    const newArticle = await request(app).post('/articles').send(article);
    expect(typeof newArticle.body).toEqual(typeof article);
    expect( newArticle.body).toHaveProperty("_id");
    expect( newArticle.statusCode).toBe(201);
    expect( newArticle.body.title).toBe(article.title);
  });
});



describe("Testing article APIs", () => {


  it("Should be able to get all article", async() => {
    const newArticle = await request(app).get('/articles');
    expect(typeof newArticle.body.length).toEqual("number");
    expect( typeof newArticle.body).toEqual("object");
    expect( newArticle.statusCode).toBe(200);
  });
});