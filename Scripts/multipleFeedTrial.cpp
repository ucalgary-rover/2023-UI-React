/*
Authors: Raisa Rafi, Rajvir Bhatti
*/

#include <opencv2/opencv.hpp>
#include <QApplication>
#include <QLabel>
#include <QVBoxLayout>
#include <QTimer>

int main(int argc, char** argv)
{
    QApplication app(argc, argv);

    // Create the main window
    QWidget window;
    QVBoxLayout* layout = new QVBoxLayout();
    window.setLayout(layout);

    const int numCameras = 2;  // Number of cameras
    QLabel* labels[numCameras];

    // Open cameras and create QLabel widgets to display the video feeds
    for (int i = 0; i < numCameras; ++i) {
        cv::VideoCapture capture(i);
        if (!capture.isOpened()) {
            qDebug() << "Failed to open camera " << i;
            continue;
        }

        // Create a QLabel widget to display the video feed
        labels[i] = new QLabel();
        layout->addWidget(labels[i]);

        // Use a QTimer to continuously update the video feed
        QTimer* timer = new QTimer();
        QObject::connect(timer, &QTimer::timeout, [=]() {
            cv::Mat frame;
            capture.read(frame);
            if (!frame.empty()) {
                cv::cvtColor(frame, frame, cv::COLOR_BGR2RGB);  // Convert the color format
                QImage qimg(frame.data, frame.cols, frame.rows, frame.step, QImage::Format_RGB888);
                labels[i]->setPixmap(QPixmap::fromImage(qimg));
                labels[i]->adjustSize();
            }
        });
        timer->start(30);  // Update every 30 milliseconds (30 fps)
    }

    window.show();
    return app.exec();
}
