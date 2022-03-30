import React, { useEffect, useState } from 'react';
import SlidingTopInfo from '../../components/SlidingTopInfo';
import { useAppSelector } from '../../state/redux/hooks';

export default function AnnotationDoneAlert() {
  const [infoIsOpen, setInfoIsOpen] = useState<boolean>(false);
  const displayNonce = useAppSelector(
    state => state.controls.annotationDoneAlertNonce
  );
  useEffect(() => {
    if (displayNonce > 0) {
      setInfoIsOpen(true);
    }
  }, [displayNonce]);
  return (
    <SlidingTopInfo
      type="success"
      text="Annotations are completed. You may proceed to statistics!"
      isOpen={infoIsOpen}
      setIsOpen={setInfoIsOpen}
      millisToDisplay={3000}
    />
  );
}
