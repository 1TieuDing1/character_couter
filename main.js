const textarea = document.getElementById('inputText');
const counter = document.querySelector('.counter');
const wordCounter = document.querySelector('.word-counter');
const warningMessage = document.getElementById('warningMessage');
const progressBar = document.getElementById('progressBar');
const maxLength = 200;

function updateCharacterCount() {
    let text = textarea.value;
    let textLength = text.length;
    let remainingCharacters = maxLength - textLength;

    // Nếu nhập quá giới hạn, cắt bớt phần dư
    if (textLength > maxLength) {
        textarea.value = text.substring(0, maxLength);
        textLength = maxLength;
        remainingCharacters = 0;
    }

    // Cập nhật số ký tự còn lại
    counter.innerText = remainingCharacters;

    // Đếm số từ
    let wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    wordCounter.innerText = wordCount;

    // Cập nhật thanh tiến trình
    progressBar.value = textLength;

    // Thay đổi màu nền dựa vào số ký tự nhập vào
    if (remainingCharacters === 0) {
        textarea.style.backgroundColor = '#483D8B';
        warningMessage.style.display = 'block';
        counter.classList.add('warning');
    } else if (remainingCharacters <= 20) {
        textarea.style.backgroundColor = '#473C8B';
        warningMessage.style.display = 'none';
        counter.classList.remove('warning');
    } else {
        textarea.style.backgroundColor = '#836FFF';
        warningMessage.style.display = 'none';
        counter.classList.remove('warning');
    }

    // Lưu vào Local Storage
    localStorage.setItem('savedText', textarea.value);
}

// Lắng nghe sự kiện nhập liệu
textarea.addEventListener('input', updateCharacterCount);

// Khôi phục nội dung từ Local Storage
window.onload = function() {
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
        textarea.value = savedText;
        updateCharacterCount();
    }
};

// Nhập liệu bằng giọng nói
function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Trình duyệt của bạn không hỗ trợ nhập giọng nói.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        textarea.value += " " + speechResult;
        updateCharacterCount();
    };

    recognition.onerror = function(event) {
        console.error("Lỗi nhận diện giọng nói:", event.error);
    };
}