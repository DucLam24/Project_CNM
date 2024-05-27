import { useEffect, useRef, useState } from "react";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";

const PreviewImageUpload = ({ images, onAddImage, onRemoveImage }) => {
  const addMoreImageRef = useRef(null);

  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const imageFiles = [];
    const fileReaders = [];
    let isCancel = false;

    if (images.length) {
      images.forEach((image) => {
        const fileReader = new FileReader();

        fileReaders.push(fileReader);
        fileReader.onload = () => {
          const { result } = fileReader;

          if (result) {
            imageFiles.push({ src: result, image });
          }
          if (imageFiles.length === images.length && !isCancel) {
            setImageUrls(imageFiles);
          }
        };

        fileReader.readAsDataURL(image);
      });
    }

    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [images]);

  const handleClickAddImage = () => {
    addMoreImageRef.current.click();
  };

  const handleAddImage = (event) => {
    const _images = [...event.target.files];
    const imageObjectKeys = images.reduce(
      (obj, item) => ({ ...obj, [item.name]: item }),
      {}
    );

    const newImages = _images.filter((image) => !imageObjectKeys[image.name]);
    onAddImage(newImages);
  };

  const handleRemoveImage = (image) => {
    onRemoveImage(image);
  };

  return (
    <Flex
      marginBottom="15px"
      justifyContent="space-between"
      alignItems="start"
      gap={5}
    >
      {images.length < 6 && (
        <Box>
          <IconButton
            aria-label="add-pic"
            size="lg"
            icon={<Icon icon="icon-park-solid:add-pic" />}
            width="60px"
            height="60px"
            backgroundColor="#e4e6eb"
            borderRadius="12px"
            fontSize="30px"
            color="teal.500"
            _hover={{ backgroundColor: "#e0e2e7" }}
            onClick={handleClickAddImage}
          />
          <input
            ref={addMoreImageRef}
            style={{ display: "none" }}
            type="file"
            multiple
            max={6}
            accept="image/png, image/jpeg"
            onChange={handleAddImage}
          />
        </Box>
      )}
      <Flex flex={1} gap={5} flexWrap="wrap">
        {imageUrls?.map((image, index) => {
          return (
            <Box key={index} position="relative" width="60px" height="60px">
              <Box
                position="absolute"
                top="-10px"
                right="-10px"
                fontSize="22px"
                onClick={() => handleRemoveImage(image)}
              >
                <Icon
                  style={{
                    cursor: "pointer",
                    backgroundColor: "white",
                    borderRadius: "100%",
                  }}
                  icon="ep:circle-close"
                />
              </Box>
              <Box
                width="100%"
                height="100%"
                overflow="hidden"
                borderRadius="12px"
              >
                <Image
                  height="100%"
                  aspectRatio={1}
                  objectFit="cover"
                  src={image.src}
                />
              </Box>
            </Box>
          );
        })}
      </Flex>
      <Box>
        <Text>{images.length}/6</Text>
      </Box>
    </Flex>
  );
};

export default PreviewImageUpload;
