plugins {
    id("java")
    id("war")
}

group = "org.infamousmarket"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}
dependencies {
    // Spring 5 Framework BOM
    implementation(platform("org.springframework:spring-framework-bom:5.3.31"))

    // Core Spring dependencies
    implementation("org.springframework:spring-context")
    implementation("org.springframework:spring-webmvc")

    // Your existing JUnit 5 dependencies
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}
tasks.test {
    useJUnitPlatform()
}