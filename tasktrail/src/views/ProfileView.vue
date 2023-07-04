<template lang="pug">
form#user-form.user-form.box.is-flex.is-flex-direction-column.mx-auto(method="post" action="/api/update/profile" enctype="multipart/form-data" @submit.prevent="submitForm")
    .profile-container.is-flex.is-flex-direction-row.is-align-items-center.block
        .profile-pic-div
            img.photo(:src='pfp' alt="profile_picture" loading="lazy")
            input.file#file(type='file' name="pfp" accept="image/png, image/gif, image/jpeg" @change="validateFileType($event)")
            label.uploadBtn(for='file') {{ $t('profile.userData.choosePic') }}
        .user-data.is-flex-is-flex-direction-column
            label.label {{ $t('profile.userData.userLabel') }}:
            .username.is-flex.is-flex-direction-row.is-align-items-center.is-justify-content-space-between
                input.input.username-input(
                    type='text' 
                    v-model='user' 
                    name="usernameInput"
                    :readonly="!userEditing"
                )
                i.fa-solid.fa-pen-to-square.button.edit-user(@click='editUser')

            label.label {{ $t('profile.userData.emailLabel') }}:
            .email.is-flex.is-flex-direction-row.is-align-items-center.is-justify-content-space-between
                input.input(type="email" disabled :value="email")

            label.label {{ $t('profile.userData.passLabel') }}:
            .password.is-flex.is-flex-direction-row.is-align-items-center.is-justify-content-space-between
                button.button(@click.prevent="sendPasswordMail()") {{ $t('profile.userData.changePass') }}

    input.button.is-primary.mb-2(type="submit" :value="$t('profile.userData.save')")
    button.button.is-danger.has-text-weight-bold(@click.prevent='deleteAccount') {{ $t('profile.userData.deleteAccount.button') }}
</template>

<script>
import alertify from "alertifyjs";
import { user } from '../router/index'
import { applyTheme, alertifysettings, sendChangePasswordMail, deleteAccount } from '../utils/helpers'
import validator from "validator"

export default {
    name: 'Profile',
    data() {
        return {
            userEditing: false,
            passEditing: false,
            user: "",
            email: "",
            pfp: "/media/images/uploads/userpic.png",
            isDataValid: false
        }
    },
    methods: {
        editUser() {
            this.userEditing = true;
        },
        editPass() {
            this.passEditing = true;
        },
        handleOutsideClick(event) {
            const target = event.target;
            const userInput = document.querySelector('.username-input');
            const editIconUser = document.querySelector('.edit-user');

            if (this.userEditing && !userInput.contains(target) && !editIconUser.contains(target)) {
                this.userEditing = false;
            }
        },
        validateFileType(event) {
            event.preventDefault();
            const fileInput = event.target;
            const file = fileInput.files[0];

            if (file) {
                if (file.size > 8000) {
                    alertify.error(this.$t('alertify.sizeError'), 'error')
                    return;
                }
                const allowedExtensions = ['jpg', 'jpeg', 'png'];
                const fileExtension = file.name.split('.').pop().toLowerCase();

                if (!allowedExtensions.includes(fileExtension)) {
                    alertify
                        .error(this.$t('alertify.imageError'), 'error')
                        .dismissOthers()
                    // Restablecer el valor del campo de archivo
                    fileInput.value = '';
                }
            }
        },
        validateUser() {
            const MAX_LENGTH = 24;
            const MIN_LENGTH = 3;
            const username = this.user.trim()

            if (!validator.isAlphanumeric(username) || username.length > MAX_LENGTH || username.length < MIN_LENGTH) {
                this.isDataValid = false;
            } else {
                this.isDataValid = true;
            }
        },
        submitForm() {
            this.validateUser();

            if (this.isDataValid) {
                alertify
                    .notify(this.$t('alertify.updateSuccess'), 'success')
                    .dismissOthers()
                setTimeout(() => {
                    document.getElementById('user-form').submit();
                }, 700);
            } else {
                alertify.error(this.$t('alertify.usernameError'), 'error').dismissOthers();
            }
        },
        async sendPasswordMail() {
            alertify
                .notify(this.$t('alertify.sentEmail'), 'success')
                .dismissOthers()

            await sendChangePasswordMail();
        },
        deleteAccount() {
            let confirmationSuccess = this.$t('profile.userData.deleteAccount.confirmationSuccess');
            let confirmationFail = this.$t('profile.userData.deleteAccount.confirmationFail');

            alertify.confirm(
                this.$t('profile.userData.deleteAccount.alertHeader'),
                this.$t('profile.userData.deleteAccount.alertMessage'),
                async function () {
                    // Obtener el valor del input text
                    let confirmInput = document.querySelector('.ajs-input');
                    let confirmValue = confirmInput.value.trim();

                    // Verificar si el valor ingresado es correcto
                    if (confirmValue === user.username.trim()) {
                        // Borrar cuenta
                        await deleteAccount();
                        alertify.success(confirmationSuccess);
                    } else {
                        // Mostrar error si el valor ingresado no es correcto
                        alertify.error(confirmationFail);
                    }
                },
                function () {}
            );
        }
    },
    async created() {
        alertify.defaults = alertifysettings;
        applyTheme();
    },
    async mounted() {
        // Get user data
        this.user = await user.username.trim()
        this.email = await user.email
        this.pfp = await user.img

        // User picture update in image input
        const imgDiv = document.querySelector('.profile-pic-div');
        const img = document.querySelector('.photo');
        const file = document.querySelector('.file');
        const uploadBtn = document.querySelector('.uploadBtn');

        imgDiv.addEventListener('mouseenter', function () {
            uploadBtn.style.display = "flex";
        });
        imgDiv.addEventListener('mouseleave', function () {
            uploadBtn.style.display = "none";
        });

        file.addEventListener('change', function () {
            const choosedFile = this.files[0];

            if (choosedFile) {
                const reader = new FileReader();

                reader.addEventListener('load', function () {
                    img.setAttribute('src', reader.result);
                });

                reader.readAsDataURL(choosedFile);
            }
        });
        // Make username not editable when clicking outside the input field
        document.addEventListener('click', this.handleOutsideClick);

        // Check for errors in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const errorParams = urlParams.get('error');

        if (errorParams) {
            alertify.error(this.$t('alertify.urlError'), 'error').dismissOthers();
        }
    },
    props: {
        alertsettings: {
            type: Object,
            default: () => { }
        }
    },
};
</script>