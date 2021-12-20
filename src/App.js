import React, { useState, useEffect } from 'react';
import serviceApi from './services/serviceApi';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button/Button';
import Spinner from './components/Loader/Spinner';
import Modal from './components/Modal';

import './App.module.scss';

export default function App() {
  const [status, setStatus] = useState('idle');
  const [query, setQuery] = useState([]);
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  useEffect(() => {
    if (!name) {
      return;
    }

    if (page === 1) {
      setStatus('pending');
      serviceApi(name, page)
        .then(query => query.hits)
        .then(query => setQuery(query), setStatus('resolved'));
    }

    if (page > 1) {
      setStatus('pending');
      serviceApi(name, page)
        .then(querys => querys.hits)
        .then(querys => {
          return (
            setQuery([...query, ...querys]),
            setStatus('resolved'),
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth',
            })
          );
        });
    }
  }, [name, page, query]);

  const handleSubmitForm = value => {
    setName(value);
    setPage(1);
  };

  const LoadBtn = () => {
    setPage(page + 1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const FindmodalImg = (id, img, tags) => {
    setModalImg({ id: id, img: img, tags: tags });
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmitForm} />
      {status === 'pending' && <Spinner />}
      <ImageGallery
        query={query}
        toggleModal={toggleModal}
        bigImg={FindmodalImg}
      />
      {status === 'resolved' && <Button onClick={LoadBtn} />}
      {showModal && <Modal closeModal={toggleModal} modalImg={modalImg} />}
    </div>
  );
}
