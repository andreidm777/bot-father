
import React from 'react';
import './settings.css';
import "@vkontakte/vkui/dist/vkui.css";
import { useState } from 'react';
import { ActionSheet, ActionSheetItem, AdaptiveIconRenderer, SplitLayout, platform } from '@vkontakte/vkui';

import StepMenu from '../menues/step';

import {
    Icon20WriteOutline,
    Icon20ListPlayOutline,
    Icon28EditOutline,
    Icon28ListPlayOutline,
    Icon28ShareOutline,
    Icon20CopyOutline,
    Icon28CopyOutline,
    Icon20DeleteOutlineAndroid,
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid,
} from '@vkontakte/icons';


export default function Settings() {
   
    return (<>
        <div className="Settings">
            <StepMenu />
            <button>настройки</button>
        </div>
    </>
    );
}
