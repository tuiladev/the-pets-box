import { React, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, GoToTopButton } from '../../common';
import * as HeaderParts from './index';
import useDropdown from '../../../hooks/useDropdown';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../redux/hooks/useAuth';

const Header = ({ className = '' }) => {
    const { isAuthenticated } = useAuth();
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();
    const headerRef = useRef(null);
    const mainMenuState = useDropdown({ openMode: 'click' });
    const mobileMenuState = useDropdown({ openMode: 'click' });

    // Mobie menu transform delay
    useEffect(() => {
        if (mobileMenuState.isOpen) {
            document.body.style.overflow = 'hidden';
            setOverlayVisible(true);
        } else {
            document.body.style.overflow = '';
            const timer = setTimeout(() => {
                setOverlayVisible(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [mobileMenuState.isOpen]);

    // Header sticky on scroll
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const headerHeight = header.offsetHeight;
        const rootElement = document.getElementById('root');

        // Tạo sentinel element để theo dõi vị trí scroll
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = `${headerHeight + 10}px`;
        sentinel.style.height = '1px';
        sentinel.style.width = '100%';
        sentinel.style.pointerEvents = 'none';

        header.parentNode.insertBefore(sentinel, header);

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isHeaderSticky = !entry.isIntersecting;
                setIsSticky(isHeaderSticky);

                if (isHeaderSticky) {
                    rootElement.style.marginTop = `${headerHeight}px`;
                } else {
                    rootElement.style.marginTop = '0px';
                }
            },
            { threshold: 0 }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
            sentinel.remove();
            rootElement.style.marginTop = '0px';
        };
    }, []);

    return (
        <>
            <header
                ref={headerRef}
                className={`
                z-50 bg-white shadow-md
                ${isSticky ? 'animate-slideInTop fixed top-0 left-0 w-full' : 'relative'}
                ${className}
            `}
            >
                {/* Phần còn lại của header giữ nguyên */}
                {!isSticky && <HeaderParts.Topbar />}
                <div className="l-container relative py-6!">
                    {/* Main Header */}
                    <div className="grid grid-cols-[2fr_1fr] justify-center gap-6 md:flex md:items-center md:justify-between md:gap-4">
                        {/* Logo */}
                        <HeaderParts.Logo />

                        {/* Searchbar */}
                        {!isSticky && (
                            <HeaderParts.SearchBar className="col-span-2 md:hidden" />
                        )}
                        {/* Searchbar cho desktop */}
                        <HeaderParts.SearchBar className="col-span-2 hidden md:block" />

                        {/* Desktop Menu */}
                        <HeaderParts.MainMenu
                            dropdownState={mainMenuState}
                            className="hidden md:block"
                        />

                        {/* Mobile Menu */}
                        {/* Overlay với hiệu ứng mờ dần có delay */}
                        {overlayVisible && (
                            <div
                                className={`fixed top-0 left-0 z-999 h-screen w-screen bg-gray-950/80 transition-opacity duration-300 md:hidden
                            ${mobileMenuState.isOpen ? 'opacity-100' : 'transition-delay-500 opacity-0'}`}
                            ></div>
                        )}
                        <HeaderParts.MobileMenu
                            dropdownState={mobileMenuState}
                            className="block md:hidden"
                        />

                        {/* User Menu Utility */}
                        <ul className="col-start-2 row-end-1 ml-auto flex gap-x-6 self-stretch md:ml-0 lg:gap-x-7">
                            {/* Tạo MenuTrigger riêng cho từng menu */}
                            <li className="order-last hidden md:order-first md:block">
                                <HeaderParts.MenuTrigger
                                    dropdownState={mainMenuState}
                                />
                            </li>
                            <li className="order-last block md:hidden">
                                <HeaderParts.MenuTrigger
                                    dropdownState={mobileMenuState}
                                />
                            </li>

                            {/* Login Button */}
                            {!isAuthenticated && (
                                <Button
                                    variant="filled"
                                    children={
                                        <>
                                            <span className="hidden md:inline">
                                                Đăng Nhập
                                            </span>
                                            <i className="fi fi-rr-arrow-right-to-bracket inline-block -translate-x-1 translate-y-0.5 text-lg md:ml-3"></i>
                                        </>
                                    }
                                    className="rounded-full max-md:aspect-square max-md:h-12 max-md:w-12 max-md:p-0!"
                                    onClick={() => navigate('/auth')}
                                />
                            )}
                            {isAuthenticated && (
                                <>
                                    <HeaderParts.Notifications />
                                    <HeaderParts.CartView />
                                    <HeaderParts.UserTools className="hidden md:block" />
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </header>

            {/* Thêm nút Go to top */}
            <GoToTopButton />
        </>
    );
};

Header.propTypes = {
    className: PropTypes.string,
};

export default Header;
