# Microservice Name

## Bussiness Domain
Simple, Easy to read, "One Sentence" Description

```
ex) User Recommendation On Vingle
    Feed on Vingle
    Interest Recommendation On Vingle
```

## Responsibility
Clear and Specific description about Responsibility of the service.
be mind that it should specify the "work" that could be directly understandable to developer also. such as "Rendering"  / "Business Logic" / "Persistency" / "Tracking".. etc

```
ex) user recommendation business logic & recommendation history logging
```


## Architecture Diagram
Simple diagram representing the architecture, which showing
1. Infrastrcture resources the service is using. such as "DynamoDB" / "RDS"
2. Other microservices that the service is consuming. such as "Vingle Feed" / "Color Extractor"
<p align="center"><img width="500px" src="http://www.conceptdraw.com/solution-park/resource/images/solutions/_aws_simple_icons/Computer-and-Networks-AWS-Architecture-Diagram-2-Tier-Auto-Scalable-Web-Application-Architecture-in-1-AZ.png" /></p>

## Infrastructures
Link to resources that deployed. such as link to "Cloudformation" or "Lambda" or "CloudWatch"


## Usage

Description about "How developer consume this service"

Most commonly it will be "HTTP Restful API", so than you could just list up the APIs.

```
Content-Type: 'application/json'
Authorization: 'token'

GET api/users/recommendations
POST api/users/recommendations/:recommendationId/feedback
```

but also, it could be a simple background worker such as Kinesis Stream consumer, or S3 Event handler

in such case, just describe how we can "Use" this service by sending event on Kinesis Stream or S3


## Maintainer

Specify who is mainly responsible for this service. meaning of responsible here is that who knows this service most, and who can help and manage other peoples to make change on the service.
it could be serveral peoples also

```
ex) spam-checker -> mooyeol
    TrackTicket -> Kurt / Shin
```
