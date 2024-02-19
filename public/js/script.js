$(document).ready(function () {

    $('#req-list').addClass('nowrap').dataTable({
        responsive: true,
        columnDefs: [{
            targets: [-1, -3],
            className: 'dt-body-right'
        }]
    });
});


/**
 * ==============================================================================+
 *                                                                               |
 *                  Callback / Function Bussiness Logic                          |
 *                                                                               |
 * ==============================================================================+
 */

function view_add_course() {
    $('#modal-add-course').modal('show');
}
function do_action_save_course() {

    $("form[name='frm-add-course']").validate({
        rules: {
            course: "required",
            mentor: "required",
            title: "required"
        },
        messages: {
            course: "Course Name lengkap tidak boleh kosong",
            mentor: "Mentor tidak boleh kosong",
            title: "Title tidak boleh kosong"
        },
        submitHandler: function (form) {
            const csrfToken = $('meta[name="csrf-token"]').attr('content');
            var course = $('#course').val();
            var mentor = $('#mentor').val();
            var title = $('#title').val();

            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                url: "/do_action_save_courses",
                dataType: 'json',
                cache: false,
                type: 'POST',
                data: {
                    "_token": csrfToken,
                    course: course,
                    mentor: mentor,
                    title: title
                },
                success: function (data) {
                    //console.log(data)

                    if (data.code === 200) {
                        Swal.fire({
                            title: "Success",
                            text: data.msg,
                            icon: "success",
                            confirmButtonText: "Ok"
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                window.location.reload();
                            } else {
                                result.dismiss;
                            }
                        });
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: data.msg,
                            showConfirmButton: false,
                            timer: 10000
                        });
                        window.location.reload();
                    }
                }
            });
        }
    });

}


function call_view_edit_course(id) {
    const csrfToken = $('meta[name="csrf-token"]').attr('content');
    var id1 = id;
    //alert(id);
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        url: "/do_get_by_course/" + id,
        dataType: 'json',
        cache: false,
        type: 'GET',
        data: {
            "_token": csrfToken,
            id: id
        },
        success: function (data) {
            $('#model-edit-course').modal('show');
            $('#id1').val(data.data.id);
            $('#course1').val(data.data.course);
            $('#mentor1').val(data.data.mentor);
            $('#title1').val(data.data.title);
        }
    });
}


function update_course() {
    $("form[name='frm-edit-course']").validate({
        rules: {
            course1: "required",
            mentor1: "required",
            title1: "required"
        },
        messages: {
            course1: "Course Name tidak boleh kosong",
            mentor1: "Mentor tidak boleh kosong",
            title1: "Title tidak boleh kosong"
        },
        submitHandler: function (form) {
            Swal.fire({
                title: "Update this data.?",
                icon: 'question',
                text: "Are you sure.!",
                showCancelButton: !0,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Yes, updated.!",
                cancelButtonText: "No, cancel.!",
                reverseButtons: !0
            }).then(function (e) {

                if (e.value === true) {
                    const csrfToken = $('meta[name="csrf-token"]').attr('content');
                    let id1 = $('#id1').val();
                    var course1 = $('#course1').val();
                    var mentor1 = $('#mentor1').val();
                    var title1 = $('#title1').val();
                    $.ajax({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        url: "/do_update_courses",
                        dataType: 'json',
                        cache: false,
                        type: 'PUT',
                        data: {
                            "_token": csrfToken,
                            course: course1,
                            mentor: mentor1,
                            title: title1,
                            id: id1
                        },
                        success: function (data) {

                            if (data.code === 200) {
                                Swal.fire({
                                    title: "Success",
                                    text: data.msg,
                                    icon: "success",
                                    confirmButtonText: "Ok"
                                }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                        window.location.reload();
                                    } else {
                                        result.dismiss;
                                    }
                                });
                            } else {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: data.msg,
                                    showConfirmButton: false,
                                    timer: 10000
                                });
                                window.location.reload();
                            }
                        }
                    });
                } else {
                    e.dismiss;
                }

            });
        }
    });
}



function delcourse(id) {
    Swal.fire({
        title: "Delete.?",
        icon: 'error',
        text: "Are you sure.!",
        showCancelButton: !0,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: "Yes, deleted.!",
        cancelButtonText: "No, cancel.!",
        reverseButtons: !0
    }).then(function (e) {

        if (e.value === true) {
            const csrfToken = $('meta[name="csrf-token"]').attr('content');
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                url: "/do_delete_courses" + '/' + id,
                dataType: 'json',
                type: "DELETE",
                data: {
                    "_token": csrfToken
                },
                success: function (data) {

                    if (data.code === 200) {
                        Swal.fire({
                            title: "Success",
                            text: data.msg,
                            icon: "success",
                            confirmButtonText: "Ok"
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                window.location.reload();
                            } else {
                                result.dismiss;
                            }
                        });
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: data.msg,
                            showConfirmButton: false,
                            timer: 10000
                        });
                        window.location.reload();
                    }
                }
            });

        } else {
            e.dismiss;
        }

    });

}




//==================================================================================




function call_view_edit_users(id) {
    const csrfToken = $('meta[name="csrf-token"]').attr('content');
    var id = id;
    //alert(id);
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        url: "/do_get_by/" + id,
        dataType: 'json',
        cache: false,
        type: 'GET',
        data: {
            "_token": csrfToken,
            id: id
        },
        success: function (data) {
            $('#defaultModal').modal('show');
            $('#id').val(data.data.id);
            $('#username').val(data.data.username);
            $('#email').val(data.data.email);
            $('#role').val(data.data.role);
        }
    });
}


function update_users() {
    $("form[name='frm-edit-users']").validate({
        rules: {
            username: "required",
            email: "required",
            role: "required"
        },
        messages: {
            username: "Username tidak boleh kosong",
            email: "Email tidak boleh kosong",
            role: "Role tidak boleh kosong"
        },
        submitHandler: function (form) {
            Swal.fire({
                title: "Update this data.?",
                icon: 'question',
                text: "Are you sure.!",
                showCancelButton: !0,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Yes, updated.!",
                cancelButtonText: "No, cancel.!",
                reverseButtons: !0
            }).then(function (e) {

                if (e.value === true) {
                    const csrfToken = $('meta[name="csrf-token"]').attr('content');
                    let id = $('#id').val();
                    var username = $('#username').val();
                    var email = $('#email').val();
                    var role = $('#role').val();
                    $.ajax({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        url: "/do_update_users",
                        dataType: 'json',
                        cache: false,
                        type: 'PUT',
                        data: {
                            "_token": csrfToken,
                            username: username,
                            email: email,
                            role: role,
                            id: id
                        },
                        success: function (data) {

                            if (data.code === 200) {
                                Swal.fire({
                                    title: "Success",
                                    text: data.msg,
                                    icon: "success",
                                    confirmButtonText: "Ok"
                                }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                        window.location.reload();
                                    } else {
                                        result.dismiss;
                                    }
                                });
                            } else {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: data.msg,
                                    showConfirmButton: false,
                                    timer: 10000
                                });
                                window.location.reload();
                            }
                        }
                    });
                } else {
                    e.dismiss;
                }

            });
        }
    });
}



function deltask(id) {
    Swal.fire({
        title: "Delete.?",
        icon: 'error',
        text: "Are you sure.!",
        showCancelButton: !0,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: "Yes, deleted.!",
        cancelButtonText: "No, cancel.!",
        reverseButtons: !0
    }).then(function (e) {

        if (e.value === true) {
            const csrfToken = $('meta[name="csrf-token"]').attr('content');
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                url: "/do_delete_users" + '/' + id,
                dataType: 'json',
                type: "DELETE",
                data: {
                    "_token": csrfToken
                },
                success: function (data) {

                    if (data.code === 200) {
                        Swal.fire({
                            title: "Success",
                            text: data.msg,
                            icon: "success",
                            confirmButtonText: "Ok"
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                window.location.reload();
                            } else {
                                result.dismiss;
                            }
                        });
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: data.msg,
                            showConfirmButton: false,
                            timer: 10000
                        });
                        window.location.reload();
                    }
                }
            });

        } else {
            e.dismiss;
        }

    });

}