/**
 * ==============================================================================+
 *                                                                               |
 *                         Call Modul or Config Library                          |
 *                                                                               |
 * ==============================================================================+
 */
const express = require('express');
const app = express();
const port = 8020;
const { db_mysql } = require('./db/Mysql_connection');
const csrf = require('csurf');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
var csrfProtection = csrf({ cookie: true });
var validator = require('validator');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



/**
 * ==============================================================================+
 *                                                                               |
 *                          Use Modul or Config Library                          |
 *                                                                               |
 * ==============================================================================+
 */
app.use(express.static(path.join(__dirname, 'public')));
//------------------------------ Start initials static asset file ----------------
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/plugins", express.static(__dirname + "public/plugins"));
app.use("/images", express.static(__dirname + "public/images"));
//------------------------------ End initials static asset file ------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'd2d6ff2aa9a76e76e991fa9b5fa21f12099f8360b65e07c3705fa4858c4a6eae4ba9f36934b729b829c03714cc823424b6516dd2010b642b75b70121cb3b3c23',
    resave: false,
    saveUninitialized: true
}));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout extractScripts', true) //Enabling to reand and load js file
app.set('trust proxy', 1);
//app.set('layout', 'layout/master_page'); Set default parent page




/**
 * ==============================================================================+
 *                                                                               |
 *                          Config Routing or Function Logic                     |
 *                                                                               |
 * ==============================================================================+
 */

app.get('/', csrfProtection, (req, res) => {
    res.render('layout/front_page', {
        csrfToken: req.csrfToken(),
        layout: false,
        judul: 'Welcome'
    });
});

app.get('/dashboard', csrfProtection, checkSignIn, (req, res) => {
    res.render('pages_dynamics/tes', {
        csrfToken: req.csrfToken(),
        sess: req.session.user,
        layout: 'layout/master_page',
        judul: 'Welcome'
    });
});

app.get('/view_add_data', csrfProtection, checkSignIn, (req, res) => {

    res.render('pages_dynamics/view_insert', {
        csrfToken: req.csrfToken(),
        layout: 'layout/master_page',
        judul: 'View | Insert Page'
    })

    /**
        let prepare_query = `SELECT * FROM biodata`;
        db_mysql.query(prepare_query, (error, results, fields) => {
            if (error) {
                console.log(error);
                return res.render('pages_dynamics/view_insert', {
                    csrfToken: req.csrfToken(),
                    layout: 'layout/master_page',
                    judul: 'View | Insert Page',
                    error: true,
                    messages: "Ada masalah koneksi Nodejs ke Mysql"
                });
            } else {

                console.log(results);

                return res.render('pages_dynamics/view_insert', {
                    csrfToken: req.csrfToken(),
                    layout: 'layout/master_page',
                    judul: 'View | Insert Page',
                    error: false,
                    data: results
                });
            }
        });
    */
});

app.post('/do_action_save', csrfProtection, checkSignIn, (req, res) => {

    let collect_data = {
        nama_lengkap: req.body.nama_lengkap,
        alamat: req.body.alamat,
        kelas: req.body.kelas
    };

    let prepare_query = 'INSERT INTO biodata SET ?';

    db_mysql.query(prepare_query, collect_data, (err, result) => {
        if (err) {
            console.log(err);
        }

        let info = {
            row_inserted: result.affectedRows,
            last_row_id_inserted: result.insertId
        };
        console.info(info);
        return res.json({
            status: true,
            code: 200,
            msg: 'Data has been successfully added'
        });
    });
});

app.get('/view_retrive_data', csrfProtection, checkSignIn, (req, res) => {


    let prepare_query = `SELECT * FROM biodata`;
    db_mysql.query(prepare_query, (error, results, fields) => {
        if (error) {
            console.log(error);
            // res.render('pages_dynamics/view_retrive', {
            //     csrfToken: req.csrfToken(),
            //     layout: 'layout/master_page',
            //     judul: 'View | Insert Page'
            // })
            return res.render('pages_dynamics/view_retrive', {
                csrfToken: req.csrfToken(),
                layout: 'layout/master_page',
                judul: 'View | Insert Page',
                error: true,
                messages: "Ada masalah koneksi Nodejs ke Mysql"
            });
        } else {

            console.table(results);

            return res.render('pages_dynamics/view_retrive', {
                csrfToken: req.csrfToken(),
                layout: 'layout/master_page',
                judul: 'View | Retrive Page',
                error: false,
                data: results
            });
        }
    });

});
/**
 * ==============================================================================+
 *                                                                               |
 *                               Course CRUD Logic                               |
 *                                                                               |
 * ==============================================================================+
 */
app.get('/view_retrive_course', csrfProtection, checkSignIn, (req, res) => {

    let prepare_query = 'SELECT * FROM courses';
    db_mysql.query(prepare_query, (error, results, fields) => {
        if (error) {
            console.log(error);
            // res.render('pages_dynamics/view_retrive', {
            //     csrfToken: req.csrfToken(),
            //     layout: 'layout/master_page',
            //     judul: 'View | Insert Page'
            // })
            return res.render('pages_dynamics/view_retrive', {
                csrfToken: req.csrfToken(),
                layout: 'layout/master_page',
                judul: 'View | Insert Page',
                error: true,
                messages: "Ada masalah koneksi Nodejs ke Mysql"
            });
        } else {

            console.table(results);

            return res.render('pages_dynamics/v_courses', {
                csrfToken: req.csrfToken(),
                layout: 'layout/master_page',
                judul: 'View | Retrive Course',
                error: false,
                data: results
            });
        }
    });

});

app.post('/do_action_save_courses', csrfProtection, checkSignIn, (req, res) => {

    let collect_data = {
        course: req.body.course,
        mentor: req.body.mentor,
        title: req.body.title
    };

    let prepare_query = 'INSERT INTO courses SET ?';

    db_mysql.query(prepare_query, collect_data, (err, result) => {
        if (err) {
            console.log(err);
        }

        let info = {
            row_inserted: result.affectedRows,
            last_row_id_inserted: result.insertId
        };
        console.info(info);
        return res.json({
            status: true,
            code: 200,
            msg: 'Data has been successfully added'
        });
    });
});

app.get('/do_get_by_course/:id', csrfProtection, checkSignIn, (req, res) => {

    let data_form = {
        id: req.params.id
    };

    let prepare_query = 'SELECT * FROM courses WHERE id = ? LIMIT 1';

    db_mysql.query(prepare_query, data_form.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        return res.json({
            status: true,
            code: 200,
            data: result[0]
        });
    });
});

app.put('/do_update_courses', csrfProtection, checkSignIn, (req, res) => {

    let { course, mentor, title, id } = req.body;

    console.log(req.body);

    let prepare_query = 'UPDATE courses SET course = ?, mentor = ?, title = ? WHERE id = ?';

    db_mysql.query(prepare_query, [course, mentor, title, id], (err, result) => {
        if (err) {
            console.log(err);
        }
        let infom = result.message;
        console.log(infom);
        return res.json({
            status: true,
            code: 200,
            msg: 'Data has been successfully updated'
        });
    });
});


app.delete('/do_delete_courses/:id', csrfProtection, checkSignIn, (req, res) => {

    let data_form = {
        id: req.params.id
    };

    let prepare_query = 'DELETE  FROM courses WHERE id = ?';

    db_mysql.query(prepare_query, data_form.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        return res.json({
            status: true,
            code: 200,
            msg: 'Data has been successfully deleted'
        });
    });
});



/**
 * ==============================================================================+
 *                                                                               |
 *                               User RUD Logic                                  |
 *                                                                               |
 * ==============================================================================+
 */
app.get('/view_retrive_users', csrfProtection, checkSignIn, (req, res) => {


    let prepare_query = 'SELECT id, username, email, role FROM users';
    db_mysql.query(prepare_query, (error, results, fields) => {
        if (error) {
            console.log(error);
            // res.render('pages_dynamics/view_retrive', {
            //     csrfToken: req.csrfToken(),
            //     layout: 'layout/master_page',
            //     judul: 'View | Insert Page'
            // })
            return res.render('pages_dynamics/view_retrive', {
                csrfToken: req.csrfToken(),
                layout: 'layout/master_page',
                judul: 'View | Insert Page',
                error: true,
                messages: "Ada masalah koneksi Nodejs ke Mysql"
            });
        } else {

            console.table(results);

            return res.render('pages_dynamics/v_users', {
                csrfToken: req.csrfToken(),
                layout: 'layout/master_page',
                judul: 'View | Retrive User',
                error: false,
                data: results
            });
        }
    });

});
app.get('/do_get_by/:id', csrfProtection, checkSignIn, (req, res) => {

    let data_form = {
        id: req.params.id
    };

    let prepare_query = 'SELECT * FROM users WHERE id = ? LIMIT 1';

    db_mysql.query(prepare_query, data_form.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        return res.json({
            status: true,
            code: 200,
            data: result[0]
        });
    });
});

app.put('/do_update_users', csrfProtection, checkSignIn, (req, res) => {

    let { username, email, role, id } = req.body;

    let prepare_query = 'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?';

    db_mysql.query(prepare_query, [username, email, role, id], (err, result) => {
        if (err) {
            console.log(err);
        }
        let infom = result.message;
        console.log(infom);
        return res.json({
            status: true,
            code: 200,
            msg: 'Data has been successfully updated'
        });
    });
});


app.delete('/do_delete_users/:id', csrfProtection, checkSignIn, (req, res) => {

    let data_form = {
        id: req.params.id
    };

    let prepare_query = 'DELETE  FROM users WHERE id = ?';

    db_mysql.query(prepare_query, data_form.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        return res.json({
            status: true,
            code: 200,
            msg: 'Data has been successfully deleted'
        });
    });
});

/**
 * ==============================================================================+
 *                                                                               |
 *                               Auth Logic                                      |
 *                                                                               |
 * ==============================================================================+
 */
function checkSignIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}
app.get('/protected_page', checkSignIn, function (req, res) {
    // res.render('protected_page', { id: req.session.user.id })
    const sess = req.session.user;

    switch (true) {
        case sess.role === 1:
            return res.redirect('/dashboard');
            break
        default:
            return res.redirect('/auth/login');
    }

});
app.get('/auth/login', csrfProtection, (req, res) => {
    res.render('layout/login_page', {
        csrfToken: req.csrfToken(),
        layout: false,
        judul: 'Auth'
    });
});

app.get('/auth/register', csrfProtection, (req, res) => {
    res.render('layout/register_page', {
        csrfToken: req.csrfToken(),
        layout: false,
        judul: 'Sign Up'
    });
});

app.post('/do_action_register', csrfProtection, (req, res) => {
    const { username, email, password } = req.body;
    let prepare_query = 'INSERT INTO users SET ?';
    let emailexist_query = 'SELECT email FROM users WHERE email = ?';
    //console.log(req.body)
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.json({
                status: false,
                code: 500,
                msg: 'Internal Server Error'
            });
        }

        db_mysql.query(emailexist_query, email, (err, rsl) => {
            // console.log(err);
            // console.log(rsl)

            switch (true) {
                case err:
                    return res.json({
                        status: false,
                        code: 500,
                        msg: err
                    });
                    break;
                case rsl.length >= 1:
                    return res.json({
                        status: false,
                        code: 302,
                        msg: `${email} already exist`
                    });
                    break;

                default:
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            return res.json({
                                status: false,
                                code: 500,
                                msg: 'Internal Server Error'
                            });
                        }

                        const rebuildKey = { username, email, password: hash };

                        //console.log(rebuildKey);
                        db_mysql.query(prepare_query, rebuildKey, (errs, results) => {

                            //console.log(results);

                            try {
                                if (errs) {
                                    return res.json({
                                        status: false,
                                        code: 400,
                                        msg: 'failled registrations'
                                    });
                                }
                                return res.json({
                                    status: false,
                                    code: 200,
                                    msg: 'success',
                                    dlink: 'login'
                                });

                            } catch (e) {
                                console.log(e.stack);
                            }
                        });
                    });
                    break;
            }
        });
    });
});
app.post('/do_action_login', csrfProtection, (req, res) => {
    const { username, password } = req.body;
    let prepare_query = 'SELECT * FROM users WHERE username = ?';
    db_mysql.query(prepare_query, username, (err, result) => {
        if (err || result.length === 0) {
            return res.json({
                status: false,
                code: 401,
                msg: 'username not match'
            });

        }
        const user = result[0];
        bcrypt.compare(password, user.password, (errs, matched) => {
            if (!matched) {
                return res.json({
                    status: false,
                    code: 401,
                    msg: 'Password not match'
                });
            }
            req.session.user = user;
            return res.json({
                status: true,
                code: 200,
                msg: 'Success',
                dlink: 'protected_page'
            });
        });
    });
});

app.post('/logout', checkSignIn, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({
                status: false,
                code: 500,
                msg: 'logout failed'
            });
            console.error('Gagal logout:', err);
        }
        return res.json({
            status: true,
            code: 200,
            msg: 'Success',
            dlink: 'login'
        });
    });
});

/**
 * ==============================================================================+
 *                                                                               |
 *                               Lister or Create Log Server                     |
 *                                                                               |
 * ==============================================================================+
 */
app.listen(port, () =>
    console.log(
        `App listening to port http://localhost:${port}, Running at: ${new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19)}`
    )
);
