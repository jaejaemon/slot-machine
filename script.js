const images = [
    'images/shoes1.jpg',
    'images/shoes2.png',
    'images/shoes3.png',
    'images/shoes4.png',
    'images/shoes5.jpg',
    'images/shoes6.png',
    'images/shoes7.png',
    'images/shoes8.png',
    'images/shoes9.png',
    'images/shoes10.png',
];

let tokens = 5;
let timerSeconds = 10;  
let isRolling = false; 

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

function spinSlotMachine() {
    if (tokens <= 0) {
        alert("Sorry, you don't have enough tokens to play.");
        return;
    }

    document.getElementById('spinButton').disabled = true;
    isRolling = true;

    tokens--;
    updateTokenDisplay();

    const slots = [
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3'),
    ];

    const spinTime = 2000; 
    const intervalTime = 100; 
    const finalImages = [];

    slots.forEach((slot, index) => {
        let count = 0;
        const interval = setInterval(() => {
            slot.innerHTML = `<img src="${getRandomImage()}" alt="Slot ${index + 1}" class="img-fluid" />`;
            count += intervalTime;

            if (count >= spinTime) {
                clearInterval(interval);
                const finalImage = getRandomImage();
                slot.innerHTML = `<img src="${finalImage}" alt="Slot ${index + 1}" class="img-fluid" />`;
                finalImages[index] = finalImage;

                if (index === slots.length - 1) {
                    checkJackpot(finalImages);
                    document.getElementById('spinButton').disabled = false;
                    isRolling = false;
                }
            }
        }, intervalTime);
    });
}

function checkJackpot(images) {
    const [img1, img2, img3] = images;

    if (img1 === img2 && img2 === img3) {
        const jackpotModal = new bootstrap.Modal(document.getElementById('jackpotModal'));
        
        const modalBody = document.querySelector('#jackpotModal .modal-body');
        modalBody.innerHTML = `Jackpot! All three images match.<br><br>
                               <div class="d-flex justify-content-center">
                                   <img src="${img1}" alt="Winning Image" class="img-fluid" style="max-width: 150px; height: auto;" />
                               </div>`;

        jackpotModal.show();
    }
}

document.getElementById('claimButton').addEventListener('click', () => {
    const jackpotModal = new bootstrap.Modal(document.getElementById('jackpotModal'));
    jackpotModal.hide(); 

    const claimModal = new bootstrap.Modal(document.getElementById('claimModal'));
    claimModal.show();
});

document.getElementById('claimForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value;

    console.log('Prize Claimed by:', { name, email, address, contact });

    alert('Your prize has been claimed! Thank you for playing.').addEventListener('click', function() {
        const jackpotModal = document.getElementById('jackpotModal');
        jackpotModal.style.display = 'none'; 
    });
});

document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
});

function updateTokenDisplay() {
    const tokenDisplay = document.getElementById('tokenCount');
    tokenDisplay.textContent = `Tokens: ${tokens}`;
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (tokens < 5) {
        timerDisplay.textContent = `Next Token in: ${timerSeconds}s`;
    } else {
        timerDisplay.textContent = '';
    }
}

function startTokenTimer() {
    setInterval(() => {
        if (tokens < 5 && timerSeconds <= 0 && !isRolling) {
            tokens++;
            updateTokenDisplay(); 
            timerSeconds = 10;
        }
        updateTimerDisplay(); 
        if (tokens < 5) {
            timerSeconds--; 
        }
    }, 1000); 
}

document.getElementById('spinButton').addEventListener('click', spinSlotMachine);

updateTokenDisplay();
updateTimerDisplay();
startTokenTimer();
