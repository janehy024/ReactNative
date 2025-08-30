import React, { useContext, useEffect, useState, useCallback } from "react";

export const useModal = () => {

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const modalOpen = useCallback(() => setIsModalVisible(true), []);
    const modalClose = useCallback(() => setIsModalVisible(false), []);

    return { isModalVisible, modalOpen, modalClose };

};