package com.onefootstep.swimmerpen;

import android.annotation.SuppressLint
import android.content.Context;
import android.graphics.Bitmap
import android.graphics.Matrix
import android.graphics.RectF
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.task.vision.detector.Detection
import org.tensorflow.lite.task.vision.detector.ObjectDetector
import android.util.Log
import androidx.camera.core.ImageProxy
import com.onefootstep.swimmerpen.util.YuvToRgbConverter;
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin

class SwimmerDetectionPlugin(context: Context): FrameProcessorPlugin("detectSwimmers") {
  private val context: Context = context
  private val yuvToRgbConverter: YuvToRgbConverter = YuvToRgbConverter(context)
  private lateinit var bitmapBuffer: Bitmap
  private lateinit var rotationMatrix: Matrix

  private fun getFrame(boundingBox: RectF): WritableNativeMap {
      val frame = WritableNativeMap()
      val tlX = boundingBox.left.toDouble()
      val tlY = boundingBox.top.toDouble()
      frame.putDouble("x", tlX)
      frame.putDouble("y", tlY)
      frame.putDouble("width", boundingBox.width().toDouble())
      frame.putDouble("height", boundingBox.height().toDouble())

      return frame
  }

  @SuppressLint("UnsafeExperimentalUsageError", "UnsafeOptInUsageError")
  private fun toBitmap(imageProxy: ImageProxy): Bitmap? {

    val image = imageProxy.image ?: return null

    // Initialise Buffer
    if (!::bitmapBuffer.isInitialized) {
        // The image rotation and RGB image buffer are initialized only once
        rotationMatrix = Matrix()
        rotationMatrix.postRotate(imageProxy.imageInfo.rotationDegrees.toFloat())
        bitmapBuffer = Bitmap.createBitmap(
            imageProxy.width, imageProxy.height, Bitmap.Config.ARGB_8888
        )
    }

    // Pass image to an image analyser
    yuvToRgbConverter.yuvToRgb(image, bitmapBuffer)

    // Create the Bitmap in the correct orientation
    return Bitmap.createBitmap(
        bitmapBuffer,
        0,
        0,
        bitmapBuffer.width,
        bitmapBuffer.height,
        rotationMatrix,
        false
    )
  }

  private fun toDetectedObjArray(outputs: List<Detection>): WritableNativeArray {
      val objArray = WritableNativeArray()
      for (output in outputs) {
        val dMap = WritableNativeMap()
        val category = output.categories.first()
        dMap.putString("label", category.label)
        dMap.putDouble("confidence", category.score.times(100).toDouble())
        dMap.putMap("frame", getFrame(output.boundingBox))
        objArray.pushMap(dMap)
      }
      return objArray
  }

  override fun callback(image: ImageProxy, params: Array<Any>): Any? {
    // code goes here
    val options = ObjectDetector.ObjectDetectorOptions.builder()
            .setMaxResults(8)
            .setScoreThreshold(0.4f)
            .build()

    val detector: ObjectDetector = ObjectDetector.createFromFileAndOptions(
            context,
            "det0_swimmer_19AP.tflite",
            options
    )


    val bmp: Bitmap = toBitmap(image) ?: return null

    val tfImage = TensorImage.fromBitmap(bmp)

    val outputs = detector.detect(tfImage)

    val data = WritableNativeMap()
    data.putArray("result", toDetectedObjArray(outputs))
    return data
  }
}
