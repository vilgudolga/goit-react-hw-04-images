import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import styles from './App.module.css';
import { fetchImages } from './API/fetchImages';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import Button from './Button/Button';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [totalImg, setTotalImg] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  useEffect(() => {
    if (query === '') {
      return;
    }
    setLoading(true);
    fetchImages(query, page)
      .then(images => {
        const pictures = images.hits.map(
          ({ id, webformatURL, tags, largeImageURL }) => ({
            id,
            webformatURL,
            tags,
            largeImageURL,
          })
        );

        if (!images.hits.length) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }

        if (page === 1 && images.hits.length) {
          Notiflix.Notify.success(
            `Hooray! We found ${images.totalHits} images.`
          );
        }

        const totalPage = images.totalHits / (page * images.hits.length);
        if (totalPage <= 1) {
          Notiflix.Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
        }
        setImages(images => [...images, ...pictures]);
        setTotalImg(images.totalHits);
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, [page, query]);

  const changeSearch = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const toggleModal = (modalImg, tags) => {
    setIsModal(!isModal);
    setModalImg(modalImg);
    setTags(tags);
  };

  return (
    <div className={styles.App}>
      <Searchbar changeSearch={changeSearch} />
      <ImageGallery images={images} toggleModal={toggleModal} />
      {loading && <Loader />}
      {images.length > 0 && images.length < totalImg && (
        <Button handleLoadMore={handleLoadMore} />
      )}
      {isModal && (
        <Modal modalImg={modalImg} onCloseModal={toggleModal} tags={tags} />
      )}
      {error && <> {error.message}</>}
    </div>
  );
};