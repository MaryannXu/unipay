'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import './menu.scss'; // Make sure to style your components appropriately

const MENU_ITEMS = [
    { name: 'Banking', href: '/banking' },
    { name: 'Credit Cards', href: '#whyus' },
    { name: 'Loans', href: '#faq' },
  ];

  const SETTINGS_ITEMS = [
    { name: 'Profile Settings', href: '/profile-settings' },
    { name: 'Account', href: '/accounts' },
    { name: 'Terms and Conditions', href: '/terms' },
  ];

  
  export default function ProductsDropdown({ isOpen, onSelect, ref }) {
    
    return (
      <div ref={ref} className="products-dropdown-container">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="products-dropdown"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="products-dropdown__list">
                {MENU_ITEMS.map((item, i) => (
                  <li
                    key={item.name}
                    className="products-dropdown__item"
                    onClick={() => onSelect(item.href)}
                  >
                    <span className="products-dropdown__text">{item.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  
