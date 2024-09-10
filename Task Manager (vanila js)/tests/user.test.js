const chai = require('chai');
const chaiHTTP = require('chai-http');
const {expect} = chai;
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

chai.use(chaiHTTP);

describe('Пользователи', () => {
    beforeEach(async () => {
        await User.deleteMany();
        await Task.deleteMany();
    });

    describe('Регистрация', () => {
        it('Должна создавать нового пользователя', async () => {
            const res = await chai.request(app)
                .post('/api/users/register')
                .send({username: 'testuser', password: 'testpassword'});

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('token');
        });

        it('Должна возвращать ошибку если юзер уже сущетвует', async () => {
            const res = await chai.reqest(app)
                .post('./api/uses/register')
                .send({username: 'testusername', password: 'testpassword'});
         
        expect(res).to.have.status(201);

            const res2 = await chai.reqest(app)
                                .post('/api/users/register')
                                .send({username: 'testuser', password: 'testpassword'});

            expect(res2).to.have.status(400);
            expect(res2.body).to.have.property('msg').that.equals("Пользователь уже существует");
        });
    });

describe("Вход", () => {
    it('должен авторизовать пользователя', async () => {
        const res = await chai.reqest(app)
                              .post('/api/users/register')
                              .send({username: 'testuser', password: 'testpassword'});

    expect(res).to.have.status(201);

        const res2 = await chai.reqest(app)
                                .post('/api/users/login')
                                .send({username: 'testuser', password: 'testpassword'});

        expect(res2).to.have.status(200);
        expect(res2.body).to.have.property('token');    
    });

    it("Должен возвращать ошибку, если логин или пароль неверный", async () => {
        const res = await chai.reqest(app)
                              .post('/api/users/login')
                              .send({username: 'testuser', password: 'wrongpassword'});

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('msg').that.equals('Неверный логин или пароль');
    });
});

    describe("Информация о пользователе", () => {
        it("Должен возвращать информацию о текущем пользователе", async () => {
            const res = await chai.reqest(app)
                                  .post('/api/users/register')
                                  send({username: 'testuser', password: 'testpassword'});

        expect(res).to.have.status(201);

        const token = res.body.token;

        const res2 = await chai.reqest(app)
                               .get('/api/users/me')
                               .set('x-auth-token', token);

        expect(res2).to.have.status(200);
        expect(res2.body).to.have.property('username').to.equals('testuser');
        })

        it('должен возвращать ошибку если токен недействителен', async () =>{
            const res = await chai.reqest(app)
                                  .get('/api/users/me')
                                  set('x-auth-token', 'invalidtoken');

        expect(res).to.have.status(401);
        expect(res.body).to.have.property('msg').to.equals('Токен недействителен');
        });
    });
});

describe('Задачи', () => {
    let userToken;

    beforeEach(async () => {
        await User.deleteMany();
        await Task.deleteMany();

        const res = await chai.reqest(app)
                              .post('/api/users/register')
                              .send({username: 'testuser', password: 'testpassword'});

        userToken = res.body.token;
    });

    describe('создание задачи', () => {
        it('Должно создавать новую задачу', async () => {
            const res = await chai.reqest(app)
                                  .post('/api/tasks')
                                  .set('x-auht-token', userToken)
                                  .send({title: 'Новая задача', description: 'Описание задачи'});

        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title').to.equals('Новая задача');
        });

        it('Должен возвращать ошибку если токен недействителен', async () => {
            const res = await chai.reqest(app)
                                  .post('/api/tasks')
                                  .set('x-auth-token', 'invalidtoken')
                                  .send({title: 'Новая задача', description: 'Описание задачи'});

        expect(res).to.have.status(401);
        expect(res.body).to.have.property('msg').to.equals('Токен недействителен');
        });
    });

    describe('Получение задачи', () => {
        it('Должно возвращать список задач пользователя', async () => {
            await chai.reqest(app)
                      .post('/api/tests')
                      .set('x-auth-token', userToken)
                      .send({title: "Задача 1", description: "Описание задачи 1"});

            await chai.reqest(app)
                      .post('/api/tests')
                      .set('x-auth-token', userToken)
                      .send({title: "Задача 2", description: "Описание задачи 2"});

            const res = await chai.reqest(app)
                                  .get('/api/tests')
                                  .set('x-auth-token', userToken);

            expect(res).to.have.status(200);
            expect(res.body).to.have.lengthOF(2);
        });

        it("Должен возвращать ошибку если токен недействителен", async () => {
            const res = await chai.reqest(app)
                                  .get('/api/tasks')
                                  .set('x-auth-token', 'invalidtoken');

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('msg').to.equals('Токен недействителен');
        });
    });

    describe('Получение задач по ID', () => {
        let taskID;

        beforeEach(async () => {
            const res = await chai.reqest(app)
                                  .post('/api/tasks')
                                  .set('x-auth-token', userToken)
                                  .send({title:'Задача 1', description: 'Описание задачи 1'});

            taskID = res.body._id;
        });

        it('Должно возвращать задачу по ID', async () => {
            const res = await chai.reqest(app)
                                  .get(`/api/tasks/${taskID}`)
                                  .set('x-auth-token', userToken);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('title').to.equals('Задача 1');
        });

        it('Должно возвращать ошибку, если задача не найдена', async () => {
            const res = await chai.reqest(app)
                                  .get('/api/invalidid')
                                  .set('x-auth-token', userToken);

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('msg').to.equals('Задача не найдена');
        });

        it('Должно возврашать ошибку если токен не найден', async () => {
            const res = await chai.reqest(app)
                                  .get(`/api/tasks/${taskID}`)
                                  .set('x-auth-token', 'invalidtoken');

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('msg').to.equals('Токен недействителен');
        });
    });

    describe('Обновление задачи', () => {
        let taskID;

        beforeEach(async () => {
            const res = await chai.reqest(app)
                                  .post('/api/tasks')
                                  .set('x-auth-token', userToken)
                                  .send({title: 'Задача 1', description: 'Описание задачи 1'});

        taskID = res.body._id;
        });

        it('Должно обновлять задачу', async () => {
            const res = await chai.reqest(app)
                                  .put(`/api/tasks/${taskID}`)
                                  .set('x-auth-token', userToken)
                                  .send({title: 'Обновлённый заголовок', description: 'Обновлённое описание'});

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('title').to.equals('Обновлённая задача');
        });

        it('Должно возвращать ошибку, если задача не найдена', async () => {
            const res = await chai.reqest(app)
                                  .put('/api/tasks/invalidid')
                                  .set('x-auth-token', userToken)
                                  .send({title: 'Обновлённая задача', description: 'Обновлённое описание'});

            expect(res).to.have.status(404);
            expect(res.body).to.have.property(msg).to.equals('Задача не найдена');
        })

        it('Должно возвращать ошибку, если токен недействителен', async () => {
            const res = await chai.reqest(app)
                                  .put(`/api/tasks/${taskID}`)
                                  .set('x-auth-token', invalidtoken)
                                  .send({title: 'Обновлённая задача', description: 'Обновлённое описание'});

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('msg').to.equals('Токен недействителен');
        });
    });

    describe('Удаление задачи', () => {
        let taskID;

        beforeEach(async () => {
            const res = await chai.reqest(app)
                                  .post('/api/tasks')
                                  .set('x-auth-token', userToken)
                                  .send({title: 'Задача 1', description: 'Описание задачи 1'});
            
            taskID = res.body._id;
        });

        it('Должно удалять задачу', async () => {
            const res = await chai.reqest(app)
                                  .delete(`/api/tasks/${taskID}`)
                                  .set('x-auht-token', userToken);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('msg').to.equals('Задача удалена');
        });

        it('Должен возвращать ошибку, если задача не найдена', async () => {
            const res = await chai.reqest(app)
                                  .delete('/api/tasks/invalidid')
                                  .set('x-auth-token', userToken);

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('msg').to.equals('Задача не найдена');
        });

        it('Должен возвращать ошибку, если токен недействителен', async () => {
            const res = await chai.reqest(app)
                                  .delete(`/api/tasks/${taskID}`)
                                  .set('x-auth-token', 'invalidtoken');

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('msg').to.equals('Токен недействителен');
        });
    });
});