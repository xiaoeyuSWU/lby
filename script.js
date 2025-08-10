// 初始化AOS动画库
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// 欢迎界面关闭逻辑
document.addEventListener('DOMContentLoaded', function() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const closeButton = document.getElementById('close-welcome');

    // 强制显示欢迎界面（无论是否首次访问）
    welcomeScreen.style.display = 'flex';
    welcomeScreen.style.opacity = '1';

    // 保留关闭按钮的逻辑
    closeButton.addEventListener('click', function() {
        // 发射五彩纸屑
        launchConfettiFromButton();

        // 隐藏欢迎界面
        welcomeScreen.style.opacity = '0';
        setTimeout(function() {
            welcomeScreen.style.display = 'none';
        }, 300);
    });

    // 点击欢迎界面背景也能关闭
    welcomeScreen.addEventListener('click', function(e) {
        if (e.target === welcomeScreen) {
            welcomeScreen.style.opacity = '0';
            setTimeout(function() {
                welcomeScreen.style.display = 'none';
            }, 300);
        }
    });
});

// 主题切换
document.getElementById('theme-toggle').addEventListener('click', function() {
    const body = document.body;
    const icon = this.querySelector('i');

    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon-o');
        icon.classList.add('fa-sun-o');
    } else {
        icon.classList.remove('fa-sun-o');
        icon.classList.add('fa-moon-o');
    }
});

// 移动端菜单切换
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const icon = this.querySelector('i');

    mobileMenu.classList.toggle('active');

    if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// 滚动进度条
window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;

    document.getElementById('progress-bar').style.width = scrollProgress + '%';
});

// 点击心形效果
document.addEventListener('click', function(e) {
    const hearts = ['❤️', '🧡', '💛', '💚', '💙', '💜', '💖', '💗', '💓', '💞'];

    const heart = document.createElement('div');
    heart.className = 'heart-animation';
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = (e.clientX - 12) + 'px';
    heart.style.top = (e.clientY - 12) + 'px';

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 4000);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });

            // 如果是移动端菜单，点击后关闭菜单
            if (window.innerWidth <= 768) {
                const mobileMenu = document.getElementById('mobile-menu');
                const menuButton = document.getElementById('mobile-menu-button');
                const icon = menuButton.querySelector('i');

                mobileMenu.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// 搜索功能
const searchModal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchClose = document.getElementById('search-close');
const desktopSearchButton = document.getElementById('desktop-search-button');
const mobileSearchButton = document.getElementById('mobile-search-button');

// 打开搜索模态框
function openSearchModal() {
    searchModal.classList.add('active');
    setTimeout(() => {
        searchInput.focus();
    }, 300);
}

// 关闭搜索模态框
function closeSearchModal() {
    searchModal.classList.remove('active');
}

// 执行搜索
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                请输入关键词进行搜索
            </div>
        `;
        return;
    }

    // 从页面中提取所有可搜索内容
    const searchableElements = document.querySelectorAll('h2, h3, p, li');
    const searchResultsArray = [];

    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();

        if (text.includes(searchTerm)) {
            // 获取元素所在的部分
            let section = element.closest('section');
            let sectionTitle = section ? section.querySelector('h2, h3')?.textContent || '其他部分' : '其他部分';

            // 获取元素的上下文
            let context = element.textContent;

            // 高亮匹配的关键词
            const highlightedContext = context.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<span class="search-highlight">${match}</span>`
            );

            searchResultsArray.push({
                title: sectionTitle,
                content: highlightedContext,
                elementId: element.closest('section')?.id || null
            });
        }
    });

    // 显示搜索结果
    if (searchResultsArray.length > 0) {
        searchResults.innerHTML = '';

        searchResultsArray.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-content" data-section-id="${result.elementId}">
                    ${result.content}
                </div>
            `;

            // 添加点击事件，跳转到对应部分
            resultItem.addEventListener('click', () => {
                if (result.elementId) {
                    const targetElement = document.getElementById(result.elementId);

                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });

                        closeSearchModal();
                    }
                }
            });

            searchResults.appendChild(resultItem);
        });
    } else {
        searchResults.innerHTML = `
            <div class="search-no-results">
                没有找到与 "${searchTerm}" 相关的内容
            </div>
        `;
    }
}

// 事件监听
desktopSearchButton.addEventListener('click', openSearchModal);
mobileSearchButton.addEventListener('click', openSearchModal);

// 点击模态框背景关闭
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        closeSearchModal();
    }
});

// 输入框变化时执行搜索
searchInput.addEventListener('input', performSearch);

// 输入框按回车键执行搜索
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// ESC键关闭搜索
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearchModal();
    }
});

// 新增（2025-07-20T12:02）
// 收集用户信息并发送到服务器
document.addEventListener('DOMContentLoaded', () => {
    // ① 采集基本信息
    const userInfo = {
        startTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        interactions: []
    };

    // ② 记录点击等交互
    document.addEventListener('click', event => {
        userInfo.interactions.push({
            time: new Date().toISOString(),
            type: 'click',
            target: event.target.tagName,
            text: (event.target.innerText || '').slice(0, 50)
        });
    });

    // ③ 统一发送函数
    function flush() {
        userInfo.endTime = new Date().toISOString(); // 更新离开时间
        const payload = JSON.stringify(userInfo);

        // 首选 sendBeacon；若不支持或失败则用 fetch keepalive
        if (!navigator.sendBeacon || !navigator.sendBeacon('/collect.php', payload)) {
            fetch('/collect.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                },
                body: payload,
                keepalive: true // 关键：允许在 pagehide 后继续传输
            });
        }
    }

    // ④ 在标签页进入后台或将被卸载时发送
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flush();
    });

    // ⑤ pagehide 是 iOS Safari 的兜底（once: true 保证只触发一次）
    window.addEventListener('pagehide', flush, { once: true });
});

function launchConfettiFromButton() {
    // 获取按钮元素
    const button = document.getElementById('close-welcome');
    if (!button) return;

    // 获取按钮位置
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 计算相对于视口的坐标
    const viewportX = x / window.innerWidth;
    const viewportY = y / window.innerHeight;

    // 配置五彩纸屑参数
    confetti({
        particleCount: 550,
        spread: 150,
        origin: {
            x: viewportX,
            y: viewportY
        },
        scalar: 1.5,
        startVelocity: 45,
        disableForReducedMotion: true
    });
}
