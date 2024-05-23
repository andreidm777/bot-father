import React from 'react';

import "@vkontakte/vkui/dist/vkui.css";
import { useState } from 'react';
import { ActionSheet, ActionSheetItem, AdaptiveIconRenderer, SplitLayout, platform } from '@vkontakte/vkui';

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

export default function StepMenu() {
    const [popout, setPopout] = useState<any>(null);
    const onClose = () => setPopout(null);
    const [filter, setFilter] = useState<string>('best');
    const onChange = (e: any) => setFilter(e.target.value);
    const iconsTargetRef = React.useRef(null);

    const openIcons = () =>
        setPopout(
            <ActionSheet onClose={onClose} toggleRef={iconsTargetRef}>
                <ActionSheetItem
                    before={
                        <AdaptiveIconRenderer IconCompact={Icon20WriteOutline} IconRegular={Icon28EditOutline} />
                    }
                >
                    Редактировать профиль
                </ActionSheetItem>
                <ActionSheetItem
                    before={
                        <AdaptiveIconRenderer
                            IconCompact={Icon20ListPlayOutline}
                            IconRegular={Icon28ListPlayOutline}
                        />
                    }
                >
                    Слушать далее
                </ActionSheetItem>
                <ActionSheetItem
                    before={
                        <AdaptiveIconRenderer IconCompact={Icon20WriteOutline} IconRegular={Icon28ShareOutline} />
                    }
                >
                    Поделиться
                </ActionSheetItem>
                <ActionSheetItem
                    before={
                        <AdaptiveIconRenderer IconCompact={Icon20CopyOutline} IconRegular={Icon28CopyOutline} />
                    }
                >
                    Скопировать ссылку
                </ActionSheetItem>
                <ActionSheetItem
                    before={
                        <AdaptiveIconRenderer
                            IconCompact={Icon20DeleteOutlineAndroid}
                            IconRegular={Icon28DeleteOutlineAndroid}
                        />
                    }
                    mode="destructive"
                >
                    Удалить плейлист
                </ActionSheetItem>
            </ActionSheet>,
        );

    return (
        <>
        <button onClick={openIcons} ref={iconsTargetRef}>авторизация</button>
        <SplitLayout popout={popout}></SplitLayout>
        </>
    );

}