/**
 * Cafe Blossom（カフェ ブロッサム） JavaScript
 * 
 * 主な機能:
 * 1. スクロール時のヘッダースタイル変化
 * 2. モバイル用ハンバーガーメニューの開閉制御
 * 3. スムーススクロール（リンククリック時のなめらかな移動）
 * 4. 要素が画面に入ったときのふわっとフェードインアニメーション（Intersection Observer）
 * 5. 「トップへ戻る」ボタンの表示制御
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. 要素の取得（HTMLから必要な部品を特定する）
  // ----------------------------------------------------
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMobile = document.getElementById('nav-mobile');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const fadeElements = document.querySelectorAll('.fade-in-up');

  // ----------------------------------------------------
  // 2. ヘッダーのスクロール検知 & 「トップへ戻る」ボタン制御
  // ----------------------------------------------------
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    // 50px以上スクロールされたらヘッダーにクラスを追加（背景色を白っぽく）
    if (scrollPosition > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 300px以上スクロールされたら「トップへ戻る」ボタンを表示
    if (scrollPosition > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // ----------------------------------------------------
  // 3. モバイル用ハンバーガーメニューの開閉処理
  // ----------------------------------------------------
  if (hamburgerBtn && navMobile) {
    // ボタンをクリックした時の動作
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMobile.classList.contains('open');
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // モバイルメニュー内のリンクをクリックしたら自動で閉じる
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // メニューを開く関数
    function openMobileMenu() {
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      hamburgerBtn.setAttribute('aria-label', 'メニューを閉じる');
      navMobile.classList.add('open');
      document.body.style.overflow = 'hidden'; // 背景スクロールを防止
    }

    // メニューを閉じる関数
    function closeMobileMenu() {
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', 'メニューを開く');
      navMobile.classList.remove('open');
      document.body.style.overflow = ''; // スクロール制限を解除
    }
  }

  // ----------------------------------------------------
  // 4. 「トップへ戻る」ボタンのクリック動作
  // ----------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------
  // 5. スクロール時のフェードインアニメーション（Intersection Observer）
  // ※ ブラウザ標準の交差監視機能を使って、要素が見えたらクラスを付与
  // ----------------------------------------------------
  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const observerOptions = {
      root: null,          // ビューポート（画面全体）を基準に判定
      rootMargin: '0px 0px -60px 0px', // 画面下部から60px手前で発火
      threshold: 0.15      // 要素の15%が見えたらトリガー
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // 一度表示されたら監視を終了してパフォーマンスを維持
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // すべての対象要素を監視対象に登録
    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // 古いブラウザ向けフォールバック（監視が使えない場合は最初から表示）
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // ----------------------------------------------------
  // 6. ページ内リンクのスムーススクロール補正
  // ※ 固定ヘッダーがあるため、スクロール位置が重ならないようオフセット調整
  // ----------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
