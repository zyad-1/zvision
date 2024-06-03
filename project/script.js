document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    const submitButton = form.querySelector('.submit-button');
    const phoneInputField = document.querySelector("#phone");
    const successDialog = document.getElementById('success-dialog');
    const errorDialog = document.getElementById('error-dialog');
    const offlineDialog = document.getElementById('offline-dialog');
    const closeSuccessDialogButton = document.getElementById('close-success-dialog');
    const closeErrorDialogButton = document.getElementById('close-error-dialog');
    const closeOfflineDialogButton = document.getElementById('close-offline-dialog');
    const whatsappJoinedInput = document.getElementById('whatsapp-joined');
    const joinWhatsappMessage = document.getElementById('join-whatsapp-message');
    const confirmWhatsappJoinBtn = document.getElementById('confirm-whatsapp-join-btn');
    const languageSelect = document.getElementById("language-select");

    // تفعيل مكتبة intl-tel-input
    const phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            fetch('https://ipinfo.io/json?token=d40cc6fbffe1fb')
                .then(response => response.json())
                .then(data => callback(data.country))
                .catch(() => callback('us'));
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // يمنع التصرف الافتراضي لإرسال النموذج

        if (!navigator.onLine) {
            offlineDialog.showModal();
            return;
        }

        // التحقق مما إذا كان المستخدم قد انضم إلى مجموعة الواتساب
        if (whatsappJoinedInput.value === "false") {
            window.open('https://chat.whatsapp.com/E5qcOCo9Y8ULN9sQxkIqQi', '_blank');
            joinWhatsappMessage.style.display = 'block';
            confirmWhatsappJoinBtn.style.display = 'inline-block';
            submitButton.style.display = 'none'; // إخفاء زر الإرسال
            return;
        }

        submitForm();
    });

    confirmWhatsappJoinBtn.addEventListener('click', function() {
        whatsappJoinedInput.value = "true";
        submitForm();
    });

    function submitForm() {
        // جمع البيانات من النموذج
        const formData = new FormData(form);
        const data = {
            fname: formData.get('fname'),
            lname: formData.get('lname'),
            age: formData.get('age'),
            email: formData.get('email'),
            phone: phoneInput.getNumber(), // جمع رقم الهاتف مع كود الدولة
            con: formData.get('con'),
            skill: formData.get('skill'),
            apps: formData.get('apps'),
            experience: formData.get('experience'),
            portfolio: formData.get('portfolio-link')
        };

        // تحقق من ملء جميع الحقول
        let isFormFilled = true;
        for (const value of formData.values()) {
            if (!value) {
                isFormFilled = false;
                break;
            }
        }

        // عرض رسالة النجاح أو رسالة الخطأ
        if (isFormFilled) {
            // إرسال البيانات إلى بوت Telegram
            const botToken = '7184632648:AAGg69fNeudduUscblOmQ1-n7Ph_8gor948';
            const chatId = '5944995483';
            const message = `New form submission:\n
            First Name: ${data.fname}\n
            Last Name: ${data.lname}\n
            Age: ${data.age}\n
            Email: ${data.email}\n
            Phone: ${data.phone}\n
            Additional Way To Communicate: ${data.con}\n
            Skill: ${data.skill}\n
            Applications: ${data.apps}\n
            Experience: ${data.experience}\n
            Portfolio: ${data.portfolio}`;

            fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        successDialog.showModal();
                    } else {
                        errorDialog.showModal();
                    }
                })
                .catch(error => {
                    errorDialog.showModal();
                });

        } else {
            errorDialog.showModal();
        }
    }

    closeSuccessDialogButton.addEventListener('click', function() {
        successDialog.close();
        confirmWhatsappJoinBtn.style.display = 'none'; // إخفاء زر تأكيد الانضمام للواتساب
        location.reload(); // إعادة تحميل الصفحة
    });

    closeErrorDialogButton.addEventListener('click', function() {
        errorDialog.close();
        confirmWhatsappJoinBtn.style.display = 'none'; // إخفاء زر تأكيد الانضمام للواتساب
        location.reload(); // إعادة تحميل الصفحة
    });

    closeOfflineDialogButton.addEventListener('click', function() {
        offlineDialog.close();
        confirmWhatsappJoinBtn.style.display = 'none'; // إخفاء زر تأكيد الانضمام للواتساب
        location.reload(); // إعادة تحميل الصفحة
    });

    languageSelect.addEventListener("change", function() {
        const selectedLanguage = languageSelect.value;
        updateLanguage(selectedLanguage);
    });

    function updateLanguage(language) {
        const elements = document.querySelectorAll("[data-en]");
        elements.forEach(element => {
            element.textContent = element.getAttribute(`data-${language}`);
        });
    }

    // تحديث اللغة الافتراضية عند التحميل
    languageSelect.dispatchEvent(new Event('change'));
});
